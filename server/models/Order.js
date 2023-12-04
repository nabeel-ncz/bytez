const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
    },
    varientId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: String,
        required: true,
    }
});

const addressSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    zipcode: { type: String, required: true },
});

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    address: addressSchema,
    status: {
        type: String,
        required: true,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled", "rejected", "return requested", "return cancelled", "request approved", "return rejected", "return recieved", "return accepted"],
        default: "pending",
    },
    deliveryDate: {
        type: Date,
        default: () => {
            const date = new Date();
            date.setDate(date.getDate() + 7);
            return date;
        },
    },
    paymentMode: {
        type: String,
        required: true,
        enum: ["COD", "RazorPay", "Wallet"],
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'failed', 'refunded']
    },
    orderNote: {
        type: String,
    },
    cancelReason: {
        type: String,
    },
    cancelledAt: {
        type: Date,
    },
    returnReason: {
        type: String,
    },
    returnRequestedAt: {
        type: Date,
    },
    items: [productSchema],
    itemsQuantity: { type: Number, required: true },
    subTotal: { type: Number, required: true },
    discount: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    couponApplied: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
},
    { timestamps: true });

const collection = mongoose.model('Order', orderSchema);
module.exports = collection;