const User = require('../models/User');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Address = require('../models/Address');

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
            if(!selectedAddress){
                return res.json({status:'error', message:'There is something went wrong!'});
            }
            const address = {
                fullName: `${selectedAddress?.firstName} ${selectedAddress?.lastName}`,
                email: selectedAddress?.email,
                phone: selectedAddress?.phone,
                address: `${selectedAddress.houseAddress}, ${selectedAddress.companyName}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`,
                zipcode: selectedAddress.zipcode,
            }
            const items = cart.items.map((doc) => {
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
            const order = await Order.create({
                userId: userId,
                address,
                paymentMode,
                orderNote,
                items,
                itemsQuantity,
                subTotal: cart.subTotal,
                discount: cart.discount,
                totalPrice: cart.totalPrice
            });
            await Cart.findByIdAndUpdate(cartId, { items: [], subTotal: 0, discount: 0, shipping: 0, totalPrice: 0});
            res.json({ status: 'ok', data: order });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
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
            if(!id || !status){
                return res.json({status:'error', message: 'There is something went wrong!'})
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
}