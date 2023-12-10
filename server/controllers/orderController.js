const User = require('../models/User');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Address = require('../models/Address');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const mongoose = require('mongoose');
const { generateInvoicePDF } = require('../helper/pdfHelper');

module.exports = {
    createOrder: async (req, res) => {
        try {
            const {
                userId,
                addressId,
                paymentMode,
                orderNote,
                cartId
            } = req.body;
            const cart = await Cart.findById(cartId);
            if (!cart) {
                return res.json({ status: 'error', message: 'Order is not possible!' });
            }
            const allAddresses = await Address.findOne({ userId });
            const selectedAddress = allAddresses?.addresses?.find((doc) => doc._id.toString() === addressId);
            if (!selectedAddress) {
                return res.json({ status: 'error', message: 'There is something went wrong!' });
            }
            const address = {
                fullName: `${selectedAddress?.firstName} ${selectedAddress?.lastName}`,
                email: selectedAddress?.email,
                phone: selectedAddress?.phone,
                address: `${selectedAddress.houseAddress}, ${selectedAddress.companyName}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`,
                zipcode: selectedAddress.zipcode,
            }
            const stockCheck = cart.items.map(async (doc) => {
                const product = await Product.findOne({
                    _id: doc.productId,
                    'varients': {
                        $elemMatch: {
                            'varientId': doc.varientId,
                            'stockQuantity': { $gte: doc.quantity }
                        }
                    }
                });
                if (!product) {
                    throw new Error(`Insufficient stock for product: ${doc.name}`);
                }
            });
            await Promise.all(stockCheck);
            const cartItems = [];
            const getVarientData = cart?.items?.map(async (doc, index) => {
                const product = await Product.aggregate([
                    {
                        $match: { _id: doc.productId }
                    },
                    {
                        $unwind: '$varients'
                    },
                    {
                        $match: { 'varients.varientId': doc.varientId }
                    },
                    {
                        $project: {
                            _id: 0,
                            name: "$title",
                            image: "$varients.images.mainImage",
                            price: "$varients.price",
                            discountPrice: "$varients.discountPrice",
                            attributes: {
                                color: "$varients.color",
                                ramAndRom: "$varients.ramAndRom"
                            }
                        }
                    }
                ])
                const item = {
                    ...cart.items[index],
                    ...product[0],
                };
                cartItems.push({
                    ...item._doc,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    discountPrice: item.discountPrice,
                    attributes: item.attributes,
                });
            });
            await Promise.all(getVarientData);
            const items = cartItems.map((doc) => {
                return {
                    productId: doc.productId,
                    varientId: doc.varientId,
                    name: doc.name,
                    image: doc.image,
                    quantity: doc.quantity,
                    price: doc.discountPrice,
                };
            });
            const itemsQuantity = cart.items.reduce((sum, doc) => sum + doc.quantity, 0);
            let paymentStatus = "pending";
            if (paymentMode === "RazorPay") {
                paymentStatus = "completed";
            };
            if (paymentMode === "Wallet") {
                const user = await User.findById(userId);
                if (user.wallet < cart.totalPrice) {
                    throw new Error("There is no enough money in the wallet");
                }
                await user.updateOne({ $inc: { wallet: -cart.totalPrice } });
                await user.save();
                paymentStatus = "completed";
            }
            const order = await Order.create({
                userId: userId,
                address,
                paymentMode,
                paymentStatus,
                orderNote,
                items,
                itemsQuantity,
                subTotal: cart.subTotal,
                discount: cart.discount,
                totalPrice: cart.totalPrice,
                couponApplied: cart?.couponApplied || 0
            });
            await Transaction.create({
                userId: userId,
                orderId: order?._id,
                paymentMethod: paymentMode,
                paymentStatus: paymentStatus,
                totalAmount: order?.totalPrice
            });

            const decreaseStock = cartItems.map(async (doc) => {
                return await Product.updateOne(
                    {
                        _id: doc.productId,
                        'varients.varientId': doc.varientId,
                    },
                    {
                        $inc: { 'varients.$.stockQuantity': -doc.quantity },
                    }
                );
            });
            await Promise.all(decreaseStock);

            await Cart.findByIdAndUpdate(cartId, { items: [], subTotal: 0, discount: 0, shipping: 0, totalPrice: 0, couponApplied: 0 });
            res.json({ status: 'ok', data: { order } });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    getRazorpayKey: async (req, res) => {
        const razorpay_key = process.env.RAZORPAY_KEY_ID;
        res.json({ status: 'ok', data: { razorpay_key } });
    },
    makeRazorpayOrder: async (req, res) => {
        try {
            const { totalAmount, cartId } = req.body;
            const cart = await Cart.findById(cartId);
            const stockCheck = cart.items.map(async (doc) => {
                const product = await Product.findOne({
                    _id: doc.productId,
                    'varients': {
                        $elemMatch: {
                            'varientId': doc.varientId,
                            'stockQuantity': { $gte: doc.quantity }
                        }
                    }
                });
                if (!product) {
                    throw new Error(`Insufficient stock for product: ${doc.name}`);
                }
            });
            await Promise.all(stockCheck);
            const instance = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET,
            });
            const options = {
                amount: totalAmount * 100,
                currency: 'INR',
            };
            const data = await instance.orders.create(options);
            res.json({ status: 'ok', data });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    verifyOrderPayment: async (req, res) => {
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cartId } = req.body;
            const sign = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(sign.toString()).digest('hex');
            if (expectedSign === razorpay_signature) {
                await Cart.findByIdAndUpdate(cartId, { items: [], subTotal: 0, discount: 0, shipping: 0, totalPrice: 0, couponApplied: 0 });
                return res.json({ status: 'ok' });
            }
            res.json({ status: 'error' })
        } catch (error) {
            res.json({ status: 'error' })
        }
    },
    getUserOrders: async (req, res) => {
        try {
            const userId = req.query?.userId;
            const page = Number(req.query?.page) || 1;
            const limit = Number(req.query?.limit) || 4;
            const skip = (page - 1) * limit;
            const totalDocuments = await Order.countDocuments({ userId: userId });
            const result = await Order.find({ userId: userId }).sort({ createdAt: 'descending' }).skip(skip).limit(limit);
            if (!result) {
                return res.json({ status: 'error', message: 'There is something went wrong, There is no items in the orders!' });
            }
            res.json({ status: 'ok', data: { orders: result, totalCount: Math.ceil((totalDocuments / limit)) } });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    getOrderById: async (req, res) => {
        try {
            const id = req.params?.id;
            const result = await Order.findById(id);
            if (!result) {
                return res.json({ status: 'error', message: 'There is something went wrong, There is no items in the orders!' });
            }
            res.json({ status: 'ok', data: result });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    getAllOrders: async (req, res) => {
        try {
            const filterBy = req.query?.filterBy;
            const startDate = req.query?.startDate || null;
            const endDate = req.query?.endDate || null;
            const page = Number(req.query?.page) || 1;
            const limit = Number(req.query?.limit) || 5;
            const skip = (page - 1) * limit;
            let filter = {};
            if (filterBy !== "all") {
                filter['status'] = filterBy;
            }
            if (startDate && startDate !== "" && endDate && endDate !== "") {
                const s = new Date(startDate);
                const e = new Date(endDate);
                filter['createdAt'] = { $gte: s, $lte: e }
            };
            const result = await Order.find(filter).sort({ updatedAt: 'descending' }).skip(skip).limit(limit).lean();
            const totalDocuments = await Order.countDocuments(filter);
            if (!result) {
                return res.json({ status: 'error', message: 'There is something went wrong, There is no items in the orders!' });
            }
            res.json({ status: 'ok', data: { orders: result, totalPage: totalDocuments === 0 ? 1 : Math.ceil(totalDocuments / limit) } });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    updateOrderStatus: async (req, res) => {
        try {
            const id = req.query?.id;
            const status = req.query?.status;
            if (!id || !status) {
                return res.json({ status: 'error', message: 'There is something went wrong!' })
            }
            let result;
            if (status === 'delivered') {
                result = await Order.findByIdAndUpdate(id, { status: status, deliveryDate: new Date() }, { new: true });
            } else {
                result = await Order.findByIdAndUpdate(id, { status: status }, { new: true });
            }
            if (!result) {
                return res.json({ status: 'error', message: 'There is something went wrong, There is no items in the orders!' });
            }
            if (status === "delivered" && result.paymentMode === "COD") {
                try {
                    await Transaction.findOneAndUpdate({ orderId: id }, { $set: { amountPaid: result.totalPrice, pendingAmount: 0 } });
                } catch (error) {
                    throw new Error(error?.message);
                }
            } else if (status === "return accepted") {
                try {
                    await User.findByIdAndUpdate(result.userId, { $inc: { wallet: result.totalPrice } });
                    await Transaction.findOneAndUpdate({ orderId: id }, { $set: { refundAmount: result.totalPrice } });
                    const increaseStock = result?.items?.map(async (doc) => {
                        return await Product.updateOne(
                            {
                                _id: doc.productId,
                                'varients.varientId': doc.varientId,
                            },
                            {
                                $inc: { 'varients.$.stockQuantity': doc.quantity },
                            }
                        );
                    });
                    await Promise.all(increaseStock);
                } catch (error) {
                    throw new Error(error?.message);
                }
            }
            res.json({ status: 'ok', data: result });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    cancelOrder: async (req, res) => {
        try {
            const { orderId, reason } = req.body;
            const date = new Date();
            const order = await Order.findById(orderId);
            if (order?.status === "pending" || order?.status === "processing") {
                await order.updateOne({ $set: { status: 'cancelled', cancelReason: reason, cancelledAt: date } });
                const increaseStock = order?.items?.map(async (doc) => {
                    return await Product.updateOne(
                        {
                            _id: doc.productId,
                            'varients.varientId': doc.varientId,
                        },
                        {
                            $inc: { 'varients.$.stockQuantity': doc.quantity },
                        }
                    );
                });
                await Promise.all(increaseStock);
                await order.save();
                if (order.paymentMode === "RazorPay" || order.paymentMode === "Wallet") {
                    try {
                        await User.findByIdAndUpdate(order.userId, { $inc: { wallet: order.totalPrice } });
                        await Transaction.findOneAndUpdate({ orderId: orderId }, { $set: { refundAmount: order.totalPrice } });
                    } catch (error) {
                        throw new Error(error?.message);
                    }
                }
                return res.json({ status: 'ok' });
            }
            res.json({ status: 'error', message: 'Order cancellation is not possible now!' });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    requestReturnOrder: async (req, res) => {
        try {
            const { orderId, reason } = req.body;
            const date = new Date();
            const order = await Order.findById(orderId);
            if (((date.getTime() - new Date(order?.deliveryDate).getTime()) / (1000 * 3600 * 24)) > 7) {
                return res.json({ status: 'error', message: "Can't request for return the order after 7 days!" });
            }
            if (order?.status === "delivered") {
                await order.updateOne({ $set: { status: "return requested", returnReason: reason, returnRequestedAt: date } });
                await order.save();
                res.json({ status: 'ok' });
            } else {
                res.json({ status: 'error', message: 'Order return not possible this time!' });
            }
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    cancelReturnRequest: async (req, res) => {
        try {
            const { orderId } = req.body;
            const order = await Order.findById(orderId);
            if (order?.status === "return requested") {
                await order.updateOne({ $set: { status: "return cancelled" } });
                await order.save();
                res.json({ status: 'ok' });
            } else {
                res.json({ status: 'error', message: 'Return cancellation is not possible this time!' });
            }
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },


    getSalesReport: async (req, res) => {
        const period = req.params?.period;
        let startDate, endDate, groupBy;
        switch (period) {
            case "daily":
                startDate = new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-01`);
                endDate = new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-31`);
                groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
                break;
            case "monthly":
                startDate = new Date(`${new Date().getFullYear()}-01-01`);
                endDate = new Date(`${new Date().getFullYear()}-12-30`);
                groupBy = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
                break;
            case "yearly":
                startDate = new Date(`${new Date().getFullYear() - 10}-01-01`);
                endDate = new Date(`${new Date().getFullYear()}-01-01`);
                groupBy = { $dateToString: { format: '%Y', date: '$createdAt' } };
                break;
            default:
                return res.json({ status: 'error', message: 'Invalid period' });
        }

        try {
            const salesReport = await Order.aggregate([
                {
                    $match: {
                        status: { $eq: 'delivered' },
                    }
                },
                {
                    $group: {
                        _id: groupBy,
                        totalSales: { $sum: '$totalPrice' },
                    },
                },
                {
                    $sort: {
                        _id: 1,
                    },
                },
            ]);
            let dateArray = getDates(startDate, endDate);
            function getDates(startDate, endDate) {
                const dateArray = [];
                let currentDate = startDate;
                while (currentDate <= endDate) {
                    dateArray.push(new Date(currentDate));
                    switch (period) {
                        case "daily": {
                            currentDate.setDate(currentDate.getDate() + 1);
                            break;
                        } case "monthly": {
                            currentDate.setMonth(currentDate.getMonth() + 1);
                            break;
                        } case "yearly": {
                            currentDate.setFullYear(currentDate.getFullYear() + 1);
                            break;
                        }
                    }
                }
                return dateArray;
            }
            const finalReport = dateArray.map((date) => {
                let dateString = "";
                switch (period) {
                    case "daily": {
                        dateString = date.toISOString().split('T')[0];
                        break;
                    }
                    case "monthly": {
                        dateString = date.toISOString().split('T')[0].split('-').splice(0, 2).join('-');
                        break;
                    }
                    case "yearly": {
                        dateString = date.toISOString().split('T')[0].split('-').splice(0, 1)[0];
                        break;
                    }
                }
                const matchingEntry = salesReport.find((entry) => entry._id === dateString);
                return {
                    date: dateString,
                    totalSales: matchingEntry ? matchingEntry.totalSales : 0,
                };
            });
            res.json({ status: 'ok', data: finalReport });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    getSalesReportByBrand: async (req, res) => {
        const brand = req.params?.brand;
        try {
            const orders = await Order.find({
                status: 'delivered',
            });
            let totalSalesByBrand = 0;
            for (const order of orders) {
                for (const item of order.items) {
                    const product = await Product.findById(item.productId);
                    if (product && product.brand.toString() === brand) {
                        totalSalesByBrand += parseFloat(item.price);
                    }
                }
            };
            res.json({ status: 'ok', data: totalSalesByBrand });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    cancelSingleProduct: async (req, res) => {
        try {
            const { productId, varientId, orderId, cancelReason } = req.body;
            if (!productId || !varientId || !orderId) {
                return res.json({ status: 'error', message: 'Something went wrong!' });
            }
            const order = await Order.findById(orderId);
            if (!order) {
                return res.json({ status: 'error', message: 'Something went wrong!' });
            };
            const item = order.items.find((doc) => doc.productId === productId && doc.varientId === varientId);
            if (!item) {
                return res.json({ status: 'error', message: 'Item not exist!' });
            };
            const product = await Product.findById(productId);
            const varient = product.varients?.find((doc) => doc.varientId === varientId);
            if (!varient) {
                return res.json({ status: 'error', message: 'Product Varient is not exist!' });
            }

            await order.updateOne({ $pull: { items: { productId, varientId } } });
            order.itemsQuantity -= 1;
            order.subTotal = order.subTotal - varient.price;
            order.totalPrice = order.totalPrice - varient.discountPrice;
            order.discount = order.subTotal - order.totalPrice;
            await order.save();

            const newOrder = new Order({
                userId: order?.userId,
                address: order?.address,
                deliveryDate: order?.deliveryDate,
                paymentMode: order?.paymentMode,
                paymentStatus: order?.paymentStatus,
                orderNote: order?.orderNote,
                items: [{
                    productId,
                    varientId,
                    ...item,
                }],
                status: "cancelled",
                cancelReason,
                cancelledAt: new Date(Date.now()),
                itemsQuantity: 1,
                subTotal: varient.price,
                discount: varient.price - varient.discountPrice,
                totalPrice: varient.discountPrice
            });
            await newOrder.save();

            await Product.updateOne(
                { _id: productId, 'varients.varientId': varientId },
                { $inc: { 'varients.$.stockQuantity': item.quantity } }
            );
            if (newOrder.paymentMode === "RazorPay" || newOrder.paymentMode === "Wallet") {
                try {
                    await User.findByIdAndUpdate(newOrder.userId, { $inc: { wallet: newOrder.totalPrice } });
                    await Transaction.findOneAndUpdate({ orderId: newOrder._id }, { $set: { refundAmount: newOrder.totalPrice } });
                } catch (error) {
                    throw new Error(error?.message);
                }
            }

            res.json({ status: 'ok' });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        };
    },
    returnSingleProduct: async (req, res) => {
        try {
            const { productId, varientId, orderId, returnReason } = req.body;
            if (!productId || !varientId || !orderId) {
                return res.json({ status: 'error', message: 'Something went wrong!' });
            }
            const order = await Order.findById(orderId);
            if (!order) {
                return res.json({ status: 'error', message: 'Something went wrong!' });
            };
            if (((new Date(Date.now()).getTime() - new Date(order?.deliveryDate).getTime()) / (1000 * 3600 * 24)) > 7) {
                return res.json({ status: 'error', message: "Can't request for return the order after 7 days!" });
            }
            const item = order.items.find((doc) => doc.productId === productId && doc.varientId === varientId);
            if (!item) {
                return res.json({ status: 'error', message: 'Item not exist!' });
            };
            const product = await Product.findById(productId);
            const varient = product.varients?.find((doc) => doc.varientId === varientId);
            if (!varient) {
                return res.json({ status: 'error', message: 'Product Varient is not exist!' });
            }

            await order.updateOne({ $pull: { items: { productId, varientId } } });
            order.itemsQuantity -= 1;
            order.subTotal = order.subTotal - varient.price;
            order.totalPrice = order.totalPrice - varient.discountPrice;
            order.discount = order.subTotal - order.totalPrice;
            await order.save();

            const newOrder = new Order({
                userId: order?.userId,
                address: order?.address,
                deliveryDate: order?.deliveryDate,
                paymentMode: order?.paymentMode,
                paymentStatus: order?.paymentStatus,
                orderNote: order?.orderNote,
                items: [{
                    productId,
                    varientId,
                    ...item,
                }],
                status: "return requested",
                returnReason,
                returnRequestedAt: new Date(Date.now()),
                itemsQuantity: 1,
                subTotal: varient.price,
                discount: varient.price - varient.discountPrice,
                totalPrice: varient.discountPrice
            });
            await newOrder.save();
            res.json({ status: 'ok' });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        };
    },
    getOrderInvoiceData: async (req, res) => {
        try {
            const orderId = req.query?.oId;
            const result = await Order.findById(orderId).populate('userId');
            const pdfBuffer = await generateInvoicePDF(result);
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", "attachment; filename=invoice.pdf");
            res.status(200).end(pdfBuffer);
        } catch (error) {
            res.json({ status: 'error', message: error?.message })
        }
    }
}