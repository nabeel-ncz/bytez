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
        enum: ['pending', 'completed', 'failed', 'refunded']
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    refundAmount: {
        type: Number,
        default: 0,
    },
    pendingAmount: {
        type: Number,
        default: function() {
            return this.paymentStatus === 'pending' ? this.totalAmount : 0;
        }
    },
    amountPaid: {
        type: Number,
        default: function() {
            return this.paymentStatus === 'completed' ? this.totalAmount : 0;
        }
    }
})
const collection = mongoose.model("Transaction", transactionSchema);
module.exports = collection;