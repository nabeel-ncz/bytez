const Coupon = require('../models/Coupon');
const Order = require('../models/Order');
const mongoose = require('mongoose');
const { validateCouponApplied, validateCouponDate } = require('../helper/couponHelper');

module.exports = {
    getAllCoupons: async (req, res) => {
        try {
            const allCoupons = await Coupon.find().lean();
            res.json({ status: 'ok', data: allCoupons });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    getAvailableCouponsForUsers: async (req, res) => {

    },
    createCoupon: async (req, res) => {
        const { code, discountPercentage, maximumDiscountAmount, validFrom, validTo, maxUsesPerUser, couponType, minimumApplicableAmount, maximumApplicableAmount, minimumPurchaseAmount } = req.body;
        try {
            await Coupon.create({
                code,
                discountPercentage,
                validFrom,
                validTo,
                maxUsesPerUser,
                couponType,
                minimumApplicableAmount,
                maximumApplicableAmount,
                minimumPurchaseAmount,
                maximumDiscountAmount
            });
            res.json({ status: 'ok' });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    updateCoupon: async (req, res) => {
        const { id, code, discountPercentage, maximumDiscountAmount, validFrom, validTo, minimumApplicableAmount, maximumApplicableAmount, maxUsesPerUser, couponType, minimumPurchaseAmount } = req.body;
        try {
            await Coupon.findByIdAndUpdate(id, {
                code,
                discountPercentage,
                validFrom,
                validTo,
                maxUsesPerUser,
                couponType,
                minimumPurchaseAmount,
                maximumApplicableAmount,
                minimumApplicableAmount,
                maximumDiscountAmount
            });
            res.json({ status: 'ok' });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    getCouponDetails: async (req, res) => {
        const id = req.params.id;
        try {
            const coupon = await Coupon.findById(id).lean();
            res.json({ status: 'ok', data: coupon });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    getAvailabeUserCoupons: async (req, res) => {
        try {
            const id = req.params?.id;
            const currDate = new Date(Date.now());
            const publicAndWelcomeCoupons = await Coupon.find({ couponType: { $in: ['public_coupon', 'welcome_coupon'] }, validTo: { $gt: currDate } });
            const userData = await Order.aggregate([
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(id),
                        status: { $in: ["delivered", "return requested", "return cancelled", "request approved", "return rejected", "return recieved", "return accepted"] },
                    },
                },
                {
                    $group: {
                        _id: '$userId',
                        maxPurchaseAmount: { $max: "$totalPrice" },
                    }
                },
            ]);
            const privateCoupons = await Coupon.find({ couponType: 'private_coupon', minimumPurchaseAmount: { $lte: userData[0]?.maxPurchaseAmount }, validTo: { $gt: currDate } });
            res.json({ status: 'ok', data: [...publicAndWelcomeCoupons, ...privateCoupons] });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    validateCoupon: async (req, res) => {
        const couponId = req.query?.id;
        const totalPrice = req.query?.price;
        const couponDetails = await Coupon.findById(couponId).lean();
        const isValidDate = validateCouponDate(couponDetails);
        let isApplicable = true;
        if (totalPrice < couponDetails.minimumApplicableAmount) {
            isApplicable = false;
        };
        if (!isValidDate) {
            return res.json({ status: 'error', message: "Coupon is valid, Please remove coupon from your cart and continue" });
        } else if (!isApplicable) {
            return res.json({ status: 'error', message: `Coupon can only apply above ₹.${couponDetails?.minimumApplicableAmount} purchase` });
        } else {
            return res.json({ status: "ok" });
        }
    }
}