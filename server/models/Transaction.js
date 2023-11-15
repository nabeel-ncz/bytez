const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Order"
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ["COD", "RazorPay", "Wallet"],
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled']
    },
    transactionAmount: {
        type: Number,
        required: true,
    },
    refundAmount: {
        type: Number,
        default: 0,
    }
})
const collection = mongoose.model("Transaction", transactionSchema);
module.exports = collection;