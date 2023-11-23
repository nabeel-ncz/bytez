const mongoose = require('mongoose');
const couponUsageSchema = new mongoose.Schema({
    couponId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Coupon",
        required: true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },
    usedCount: {
        type: Number,
        default: 0,
    },
})
const collection = mongoose.model("CouponUsage",couponUsageSchema);
module.exports = collection;