const mongoose = require('mongoose');
const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true,
    },
    discountPercentage: {
        type: Number,
        required: true,
    },
    validFrom: {
        type: Date,
        required: true,
    },
    validTo: {
        type: Date,
        required: true,
    },
    minimumApplicableAmount: {
        type: Number,
        required: true,
    },
    maximumApplicableAmount: {
        type: Number,
        required: true,
    },
    maximumDiscountAmount: {
        type: Number,
        required: true,
    },
    couponType: {
        type: String,
        enum: ['public_coupon', 'private_coupon', 'welcome_coupon'],
        default: 'public_coupon',
    },
    maxUsesPerUser: {
        type: Number,
        default: 1,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    minimumPurchaseAmount: {
        type: Number,
    }
}, {
    timestamps: true,
})
const collection = mongoose.model("Coupon", couponSchema);
module.exports = collection;