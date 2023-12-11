const Coupon = require('../models/Coupon');
const CouponUsage = require('../models/CouponUsage');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const mongoose = require('mongoose');
const { validateCouponDate } = require('../helper/couponHelper');

module.exports = {
    applyCouponInCart: async (req, res) => {
        try {
            const { id, couponCode, cartId } = req.body;
            const publicAndWelcomeCoupons = await Coupon.find({ couponType: { $in: ['public_coupon', 'welcome_coupon'] } });
            const userData = await Order.aggregate([
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(id),
                        status: { $in: ["delivered", "return requested", "return cancelled", "request approved", "return rejected", "return recieved", "return accepted"] },
                    }
                },
                {
                    $group: {
                        _id: '$userId',
                        maxPurchaseAmount: { $max: "$totalPrice" },
                    }
                },
            ]);
            const privateCoupons = await Coupon.find({ couponType: 'private_coupon', minimumPurchaseAmount: { $lte: userData[0]?.maxPurchaseAmount } });
            const totalCoupons = [...publicAndWelcomeCoupons, ...privateCoupons];
            const match = totalCoupons.find((item) => item.code === couponCode);
            if (match) {
                const isDateValid = validateCouponDate(match);
                if (!isDateValid) {
                    return res.json({ status: 'error', message: "Coupon is valid!" });
                }
                const cart = await Cart.findById(cartId);
                if (cart?.totalPrice >= match?.minimumApplicableAmount && cart?.totalPrice <= match?.maximumApplicableAmount) {
                    const couponUsage = await CouponUsage.findOne({ couponId: match._id, userId: id });
                    if (couponUsage) {
                        if (couponUsage.usedCount < match.maxUsesPerUser) {
                            couponUsage.usedCount++;
                            await couponUsage.save();
                        } else {
                            return res.json({ status: 'error', message: "Coupon is already used!" });
                        }
                    } else {
                        const newCouponUsage = new CouponUsage({
                            couponId: match._id,
                            userId: id,
                            usedCount: 1,
                        });
                        await newCouponUsage.save();
                    }
                    const discountAmount = Math.floor(((cart?.totalPrice * match?.discountPercentage) / 100));
                    await cart.updateOne({ couponApplied: discountAmount, $inc: { totalPrice: -discountAmount }, coupon: match._id });
                    await cart.save();
                    res.json({ status: 'ok', data: {} });
                } else if (cart?.totalPrice >= match?.minimumApplicableAmount && cart?.totalPrice > match?.maximumApplicableAmount) {
                    const couponUsage = await CouponUsage.findOne({ couponId: match._id, userId: id });
                    if (couponUsage) {
                        if (couponUsage.usedCount < match.maxUsesPerUser) {
                            couponUsage.usedCount++;
                            await couponUsage.save();
                        } else {
                            return res.json({ status: 'error', message: "Coupon is already used!" });
                        }
                    } else {
                        const newCouponUsage = new CouponUsage({
                            couponId: match._id,
                            userId: id,
                            usedCount: 1,
                        });
                        await newCouponUsage.save();
                    }
                    const discountAmount = match.maximumDiscountAmount;
                    await cart.updateOne({ couponApplied: discountAmount, $inc: { totalPrice: -discountAmount }, coupon: match._id });
                    await cart.save();
                    res.json({ status: 'ok', data: {} });
                } else {
                    res.json({ status: 'error', message: `Coupon can only apply above ₹.${match.minimumApplicableAmount} purchase` });
                }
            } else {
                res.json({ status: 'error', message: "Coupon is not availble" });
            };
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    removeCouponFromCart: async (req, res) => {
        try {
            const { cartId, userId } = req.body;
            const cart = await Cart.findById(cartId);
            cart.totalPrice = cart.totalPrice + cart.couponApplied;
            cart.couponApplied = 0;
            await cart.save();
            const couponUsage = await CouponUsage.findOne({ userId: userId, couponId: cart?.coupon });
            couponUsage.usedCount--;
            await couponUsage.save();
            res.json({ status: 'ok' });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    }
}