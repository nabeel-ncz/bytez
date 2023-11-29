const Coupon = require('../models/Coupon');

const validateCouponApplied = (cartTotalAmount, couponDetails) => {
    if (cartTotalAmount <= couponDetails.maximumApplicableAmount && cartTotalAmount >= couponDetails?.minimumApplicableAmount) {
        return true
    } else {
        return false;
    }
}

const validateCouponDate = (couponDetails) => {
    const currentDate = new Date();
    console.log(couponDetails, currentDate)
    if (new Date(couponDetails.validTo) - currentDate > 0) {
        return true;
    } else {
        return false;
    }
};


module.exports = { validateCouponApplied, validateCouponDate };