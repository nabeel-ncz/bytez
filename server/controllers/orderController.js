const User = require('../models/User');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Address = require('../models/Address');
const Product = require('../models/Product');
const Razorpay = require('razorpay');
const crypto = require('crypto');

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
                totalPrice: cart.totalPrice
            });
            //online payment - razorpay
            await Cart.findByIdAndUpdate(cartId, { items: [], subTotal: 0, discount: 0, shipping: 0, totalPrice: 0 });
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
                await Cart.findByIdAndUpdate(cartId, { items: [], subTotal: 0, discount: 0, shipping: 0, totalPrice: 0 });
                return res.json({ status: 'ok' });
            }
            res.json({ status: 'error' })
        } catch (error) {
            res.json({ status: 'error' })
        }
    },
    getUserOrders: async (req, res) => {
        try {
            const userId = req.params?.id;
            const result = await Order.find({ userId: userId });
            if (!result) {
                return res.json({ status: 'error', message: 'There is something went wrong, There is no items in the orders!' });
            }
            res.json({ status: 'ok', data: result });
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
            const result = await Order.find({}).lean();
            if (!result) {
                return res.json({ status: 'error', message: 'There is something went wrong, There is no items in the orders!' });
            }
            res.json({ status: 'ok', data: result });
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
            const result = await Order.findByIdAndUpdate(id, { status: status }, { new: true });
            if (!result) {
                return res.json({ status: 'error', message: 'There is something went wrong, There is no items in the orders!' });
            }
            res.json({ status: 'ok', data: result });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    cancelOrder: async (req, res) => {
        try {
            const orderId = req.params?.id;
            await Order.findByIdAndUpdate(orderId, { $set: { status: 'cancelled' } });
            res.json({ status: 'ok' });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },

}