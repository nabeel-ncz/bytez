const Coupon = require('../models/Coupon');
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
        const { code, discountPercentage, validFrom, validTo, maxUsesPerUser, status, couponType } = req.body;
        try {
            await Coupon.create({
                code,
                discountPercentage,
                validFrom,
                validTo,
                maxUsesPerUser,
                isActive: status,
                couponType,
            });
            res.json({ status: 'ok' });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    updateCoupon: async (req, res) => {
        const { id, code, discountPercentage, validFrom, validTo, maxUsesPerUser, status, couponType } = req.body;
        try {
            await Coupon.findByIdAndUpdate(id, {
                code,
                discountPercentage,
                validFrom,
                validTo,
                maxUsesPerUser,
                isActive: status,
                couponType
            });
            res.json({ status: 'ok' });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    }
}