const bcrypt = require('bcrypt');
const User = require('../models/User');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { generateUserToken, generateOtpToken, verifyOtpToken, verifyUserToken, generateResetPasswordToken, verifyResetPasswordToken } = require('../helper/jwtHelper');
const { generateOTP } = require('../helper/otpHelper');
const { sendOtpMail, sendResetPasswordMail } = require('../helper/mailHelper');
const mongoose = require('mongoose');
const { validateCouponApplied } = require('../helper/couponHelper');
const { validateRefferalCode, generateReferralCode } = require('../helper/manageRefferalCode');
const Coupon = require('../models/Coupon');

module.exports = {
    registerUser: async (req, res) => {
        const { name, email, password, referral } = req.body;
        try {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            const currDate = Date.now();
            const user = await User.create({ name, email, password: hash, createdAt: currDate, wallet: 0 });
            if (!user) {
                res.json({ status: "error", message: "Something went wrong!" });
                return;
            }
            if (referral) {
                const isValid = validateRefferalCode(referral);
                if (isValid) {
                    const user = await User.findById(isValid.id);
                    if (user) {
                        user.wallet += 100;
                        if (user.referral) {
                            user.referral += 100;
                        } else {
                            user.referral = 100;
                        }
                        await user.save();
                    };
                }
            }

            const token = generateUserToken({ id: user._id, isVerified: false });
            res.cookie("user_key", token, { maxAge: 1000 * 60 * 60 * 24 * 2, httpOnly: true });
            res.json({ status: "ok", data: user });
        } catch (error) {
            if (error.code === 11000) {
                res.json({ status: "error", message: "Email is already exist!" })
            } else {
                res.json({ status: "error", message: error.message });
            }
        }
    },
    loginUser: async (req, res) => {
        const { email, password } = req.body;
        try {
            const exist = await User.findOne({ email: email });
            if (!exist) {
                res.json({ status: "error", message: "Email doesn't exist!" });
                return;
            }
            const match = await bcrypt.compare(password, exist?.password);
            if (match) {
                const token = generateUserToken({ id: exist._id, isVerified: exist.verified });
                res.cookie("user_key", token, { maxAge: 1000 * 60 * 60 * 24 * 2, httpOnly: true });
                res.json({ status: "ok", data: exist });
            } else {
                res.json({ status: "error", message: "Email or Password is incorrect!" });
            }
        } catch (error) {
            res.json({ status: "error", message: error.message });
        }
    },
    verifyEmail: async (req, res) => {
        const { otp } = req.body;
        try {
            const otpToken = req.cookies?.otp_key;
            if (!otpToken) {
                res.json({ status: "error", message: "OTP is valid!" });
            } else {
                const result = verifyOtpToken(otp, otpToken);
                console.log(result)
                if (result.status === "ok") {
                    const response = await User.findByIdAndUpdate(result.data.userId, { $set: { verified: true } }, { new: true });
                    res.cookie("otp_key", "", { maxAge: 1 });
                    const token = generateUserToken({ id: result.data.userId, isVerified: true });
                    res.cookie("user_key", token, { maxAge: 1000 * 60 * 60 * 24 * 2, httpOnly: true });
                    res.json({ status: "ok", data: response });
                } else {
                    res.json(result);
                }
            }
        } catch (error) {
            res.json({ status: "error", message: error.message });
        }
    },
    sendOtp: async (req, res) => {
        const userToken = req.cookies?.user_key;
        const email = req.query?.email;
        if (!userToken || !email) {
            res.json({ status: "error" });
        } else {
            const result = verifyUserToken(userToken);
            if (result.status === "ok") {
                const { otp, key } = generateOtpToken(result.data?.id);
                res.cookie("otp_key", key, { maxAge: 1000 * 60 * 2, httpOnly: true });
                await sendOtpMail({ otp, email });
                res.json({ status: "ok" });
            } else {
                res.json({ status: "error" });
            }
        }
    },
    checkUserExist: async (req, res) => {
        const token = req.cookies?.user_key;
        try {
            if (token) {
                const result = verifyUserToken(token);
                if (result.status === "ok") {
                    const response = await User.findOne({ _id: result.data.id });
                    if (response) {
                        res.json({ status: "ok", data: response });
                    } else {
                        res.json({ status: "error", message: "Token is not valid!" });
                    }
                } else {
                    res.json({ status: "error", message: "Token is not valid!" });
                }
            } else {
                res.json({ status: "error", message: "Token is not exist!" });
            }
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        }
    },
    logout: async (req, res) => {
        try {
            res.cookie("user_key", "", { maxAge: 1 });
            res.json({ status: 'ok' });
        } catch (error) {
            res.json({ status: 'error' });
        }
    },
    googleAuthSuccess: async (req, res) => {
        if (req?.user?._id) {
            const token = generateUserToken({ id: req.user._id, isVerified: true });
            res.cookie("user_key", token, { maxAge: 1000 * 60 * 60 * 24 * 2, httpOnly: true });
            res.redirect(`${process.env.CLIENT_URL}`);
        } else {
            res.redirect(`${process.env.CLIENT_URL}login?error=${encodeURIComponent("Authentication Failed")}`);
        }

    },
    googleAuthFailed: async (req, res) => {
        res.redirect(`${process.env.CLIENT_URL}login?error=${encodeURIComponent("Authentication Failed")}`);
    },

    getAllUsers: async (req, res) => {
        try {
            const page = Number(req.query?.page) || 1;
            const limit = Number(req.query?.limit) || 5;
            const skip = (page - 1) * limit;
            const users = await User.find({ role: "User" }).skip(skip).limit(limit).lean();
            const totalDocuments = await User.countDocuments({ role: "User" });
            if (!users || users.length === 0) {
                res.json({ status: "error", data: {}, message: "Users not found!" });
            } else {
                res.json({ status: "ok", data: { users, totalPage: Math.ceil(totalDocuments / limit) } });
            }
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        }
    },

    getUser: async (req, res) => {
        const userId = req.params?.id;
        try {
            const user = await User.findOne({ _id: userId });
            if (!user) {
                res.json({ status: "error", data: {}, message: "User not found!" });
            } else {
                res.json({ status: "ok", data: user });
            }
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        }
    },
    changeUserStatus: async (req, res) => {
        const id = req.query?.id;
        const status = req.query?.status;
        try {
            if (!id || !status) {
                res.json({ status: "error" });
            } else {
                await User.updateOne({ _id: id }, { isBlocked: status });
                res.json({ status: "ok" });
            }
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        }
    },
    addProductToCart: async (req, res) => {
        try {
            console.log(req.body)
            const { userId, productId, varientId } = req.body;
            const exist = await Cart.findOne({ userId });
            const product = await Product.findById(productId);
            if (!product) {
                return res.json({ status: 'error', message: 'Product not found!' });
            }
            const varient = product.varients.find((doc) => doc.varientId === varientId);
            if (varient.stockQuantity === 0) {
                return res.json({ status: 'error', message: `Insufficient stock for the product ${product.title}` });
            }
            if (!exist) {
                await Cart.create({
                    userId: userId,
                    items: [{
                        productId: productId,
                        varientId: varient.varientId,
                        quantity: 1,
                    }],
                    subTotal: varient.price,
                    totalPrice: varient.discountPrice,
                    discount: varient.price - varient.discountPrice,
                });
                res.json({ status: 'ok' });
            } else {
                const varientExist = exist.items.find((doc) => doc.varientId === varientId);
                if (varientExist) {
                    return res.json({ status: "error", message: "Varient is already exist in the cart!" });
                }
                if (exist?.couponApplied !== 0) {
                    const subTotalAmount = (exist.subTotal + exist.couponApplied) + varient.price;
                    const totalAmount = (exist.totalPrice + exist.couponApplied) + varient.discountPrice;
                    const couponDetails = await Coupon.findById(exist?.coupon);
                    const isCouponApplicable = validateCouponApplied(totalAmount, couponDetails);
                    if (isCouponApplicable) {
                        const discountAmount = Math.floor(((totalAmount * couponDetails?.discountPercentage) / 100));
                        exist.subTotal = subTotalAmount;
                        exist.totalPrice = totalAmount - discountAmount;
                        exist.couponApplied = discountAmount;
                        exist.discount = (subTotalAmount - (totalAmount - discountAmount));
                        exist.items.push({
                            productId: productId,
                            varientId: varient.varientId,
                            quantity: 1,
                        });
                        const updatedCart = await exist.save();
                        res.json({ status: 'ok', data: updatedCart });
                    } else {
                        if (totalAmount >= couponDetails.minimumApplicableAmount && totalAmount > couponDetails.maximumApplicableAmount) {
                            const discountAmount = couponDetails.maximumDiscountAmount;
                            exist.subTotal = subTotalAmount;
                            exist.totalPrice = totalAmount - discountAmount;
                            exist.couponApplied = discountAmount;
                            exist.discount = (subTotalAmount - (totalAmount - discountAmount));
                            exist.items.push({
                                productId: productId,
                                varientId: varient.varientId,
                                quantity: 1,
                            });
                            const updatedCart = await exist.save();
                            return res.json({ status: 'ok', data: updatedCart });
                        } else {
                            res.json({ status: 'error', message: `Coupon can only apply above ₹.${couponDetails.minimumApplicableAmount} purchase` });
                        }
                    }
                } else {
                    exist.items.push({
                        productId: productId,
                        varientId: varient.varientId,
                        quantity: 1,
                    });
                    exist.subTotal += varient.price;
                    exist.totalPrice += varient.discountPrice;
                    exist.discount += (varient.price - varient.discountPrice);
                    const updatedCart = await exist.save();
                    res.json({ status: 'ok', data: updatedCart });
                }
            }
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    getAllCartProducts: async (req, res) => {
        try {
            const userId = req?.params?.id;
            const result = await Cart.findOne({ userId }).lean();
            const getVarientData = result?.items?.map(async (doc, index) => {
                const product = await Product.aggregate([
                    {
                        $match: { _id: doc.productId }
                    },
                    {
                        $unwind: '$varients'
                    },
                    {
                        $match: { 'varients.varientId': doc.varientId }
                    },
                    {
                        $project: {
                            _id: 0,
                            name: "$title",
                            image: "$varients.images.mainImage",
                            price: "$varients.price",
                            discountPrice: "$varients.discountPrice",
                            attributes: {
                                color: "$varients.color",
                                ramAndRom: "$varients.ramAndRom"
                            }
                        }
                    }
                ]);
                if (!product) {
                    throw new Error(`Insufficient stock for product: ${doc.name}`);
                } else {
                    result.items[index] = {
                        ...result.items[index],
                        ...product[0],
                    };
                }
            });
            await Promise.all(getVarientData);
            const totalPrice = result.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
            const discountPrice = result.items.reduce((sum, item) => sum + (item.quantity * item.discountPrice), 0);
            const cart = await Cart.findOne({ userId: userId });
            cart.subTotal = totalPrice;
            cart.discount = totalPrice - discountPrice;
            cart.totalPrice = discountPrice - cart?.couponApplied;
            await cart.save();
            result.subTotal = totalPrice;
            result.discount = totalPrice - discountPrice;
            result.totalPrice = discountPrice - cart?.couponApplied;
            res.json({ status: 'ok', data: result });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    changeProductQuantity: async (req, res) => {
        try {
            const { userId, productId, varientId, quantityToAdd } = req.body;
            const product = await Product.findById(productId);
            const varient = product.varients.find((v) => v.varientId === varientId);
            if (!varient) {
                return res.json({ status: 'error', message: 'Product not found!' });
            }
            const availableQuantity = varient.stockQuantity;
            const cart = await Cart.findOne({ userId });
            if (!cart) {
                return res.json({ status: 'error', message: 'Cart is not exist!' });
            }
            const itemIndex = cart.items.findIndex(item => item.varientId === varientId);
            if (itemIndex === -1) {
                return res.json({ status: 'error', message: 'Item not exist in the Cart!' });
            }
            cart.items[itemIndex].quantity += quantityToAdd;
            if (cart.items[itemIndex].quantity > availableQuantity) {
                return res.json({ status: 'error', message: 'Product is Out of stock!' });
            }
            const cartItems = [];
            const getVarientData = cart?.items?.map(async (doc, index) => {
                const product = await Product.aggregate([
                    {
                        $match: { _id: doc.productId }
                    },
                    {
                        $unwind: '$varients'
                    },
                    {
                        $match: { 'varients.varientId': doc.varientId }
                    },
                    {
                        $project: {
                            _id: 0,
                            name: "$title",
                            image: "$varients.images.mainImage",
                            price: "$varients.price",
                            discountPrice: "$varients.discountPrice",
                            attributes: {
                                color: "$varients.color",
                                ramAndRom: "$varients.ramAndRom"
                            }
                        }
                    }
                ]);
                const item = {
                    ...cart.items[index],
                    ...product[0],
                };
                cartItems.push({
                    ...item._doc,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    discountPrice: item.discountPrice,
                    attributes: item.attributes,
                });
            });
            await Promise.all(getVarientData);
            console.log(cartItems)
            const subTotalAmount = cartItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
            const totalAmount = cartItems.reduce((sum, item) => sum + (item.quantity * item.discountPrice), 0);
            const couponDetails = await Coupon.findById(cart?.coupon);
            if (cart?.couponApplied !== 0) {
                const isCouponApplicable = validateCouponApplied(totalAmount, couponDetails);
                if (isCouponApplicable) {
                    const discountAmount = Math.floor(((totalAmount * couponDetails?.discountPercentage) / 100));
                    cart.subTotal = subTotalAmount;
                    cart.totalPrice = totalAmount - discountAmount;
                    cart.couponApplied = discountAmount;
                    cart.discount = (subTotalAmount - (totalAmount - discountAmount));
                    const updatedCart = await cart.save();
                    res.json({ status: 'ok', data: updatedCart });
                } else {
                    if (totalAmount >= couponDetails.minimumApplicableAmount && totalAmount > couponDetails.maximumApplicableAmount) {
                        const discountAmount = couponDetails.maximumDiscountAmount;
                        cart.subTotal = subTotalAmount;
                        cart.totalPrice = totalAmount - discountAmount;
                        cart.couponApplied = discountAmount;
                        cart.discount = (subTotalAmount - (totalAmount - discountAmount));
                        const updatedCart = await cart.save();
                        return res.json({ status: 'ok', data: updatedCart });
                    } else {
                        res.json({ status: 'error', message: `Coupon can only apply above ₹.${couponDetails.minimumApplicableAmount} purchase` });
                    }
                }
            } else {
                cart.subTotal = subTotalAmount;
                cart.totalPrice = totalAmount;
                cart.discount = subTotalAmount - totalAmount;
                const updatedCart = await cart.save();
                res.json({ status: 'ok', data: updatedCart });
            }
        } catch (error) {
            res.json({ status: 'error', error: error?.message });
        }
    },
    deleteProductFromCart: async (req, res) => {
        try {
            const userId = req?.query?.uId;
            const varientId = req?.query?.vId;
            const cart = await Cart.findOne({ userId });
            if (!cart) {
                return res.json({ status: 'error', message: 'Cart not exist!' });
            }
            const itemToDelete = cart.items.find((doc) => doc.varientId === varientId);
            if (!itemToDelete) {
                return res.json({ status: 'error', message: 'No Items to delete!' });
            }
            const productToDelete = await Product.aggregate([{ $match: { _id: itemToDelete.productId } }, { $unwind: '$varients' }, { $match: { 'varients.varientId': itemToDelete.varientId } },
            {
                $project: {
                    _id: 0,
                    name: "$title",
                    image: "$varients.images.mainImage",
                    price: "$varients.price",
                    discountPrice: "$varients.discountPrice",
                    attributes: {
                        color: "$varients.color",
                        ramAndRom: "$varients.ramAndRom"
                    }
                }
            }
            ]);
            const subTotal = (cart.subTotal+cart.couponApplied) - (itemToDelete.quantity * productToDelete[0].price);
            const totalPrice = (cart.totalPrice+cart.couponApplied) - (itemToDelete.quantity * productToDelete[0].discountPrice);
            const discount = subTotal - totalPrice;
            const updatedItems = cart.items.filter((doc) => doc.varientId !== varientId);
            if (cart?.couponApplied !== 0) {
                const couponDetails = await Coupon.findById(cart?.coupon);
                const isCouponApplicable = validateCouponApplied(totalPrice, couponDetails);
                if (isCouponApplicable) {
                    const couponDiscount = Math.floor(((totalPrice * couponDetails?.discountPercentage) / 100));
                    const updatedCart = await Cart.findOneAndUpdate({ userId }, {
                        items: updatedItems,
                        subTotal,
                        totalPrice: totalPrice - couponDiscount,
                        couponApplied: couponDiscount,
                        discount,
                    }, { new: true });
                    res.json({ status: 'ok', data: updatedCart });
                } else {
                    if (totalPrice >= couponDetails.minimumApplicableAmount && totalPrice > couponDetails.maximumApplicableAmount) {
                        const couponDiscount = couponDetails.maximumDiscountAmount;
                        const updatedCart = await Cart.findOneAndUpdate({ userId }, {
                            items: updatedItems,
                            subTotal,
                            totalPrice: totalPrice - couponDiscount,
                            couponApplied: couponDiscount,
                            discount,
                        }, { new: true });
                        res.json({ status: 'ok', data: updatedCart });
                    } else {
                        res.json({ status: 'error', message: `Coupon can only apply above ₹.${couponDetails.maximumApplicableAmount} purchase` });
                    }
                }
            } else {
                const updatedCart = await Cart.findOneAndUpdate({ userId }, {
                    items: updatedItems,
                    subTotal,
                    totalPrice,
                    discount,
                }, { new: true });
                res.json({ status: 'ok', data: updatedCart });
            }
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    updateUserInform: async (req, res) => {
        try {
            const { userId, firstName, lastName, email, phone } = req.body;
            await User.findByIdAndUpdate(userId, {
                name: firstName + " " + lastName,
                email: email,
                phone: phone
            });
            res.json({ status: 'ok' });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    updateUserPassword: async (req, res) => {
        try {
            const { userId, current_password, new_password } = req.body;
            const user = await User.findById({ _id: userId });
            if (!user) {
                return res.json({ status: 'error', message: 'User not exist!' });
            };
            if (user.oauth) {
                return res.json({ status: 'error', message: "Password can't be change" });
            }
            const match = await bcrypt.compare(current_password, user.password);
            if (match) {
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(new_password, salt);
                const updatedUser = await User.findByIdAndUpdate(userId, { password: hash });
                if (!updatedUser) {
                    return res.json({ status: 'error', message: 'User not exist!' });
                }
                res.json({ status: 'ok' });
            } else {
                return res.json({ status: 'error', message: 'Current Password is not correct!' });
            }
        } catch (error) {
            return res.json({ status: 'error', message: error?.message });
        }
    },
    resetPassword: async (req, res) => {
        try {
            const email = req?.query?.email;
            const user = await User.findOne({ email });
            if (!user) {
                res.json({ status: "error", message: "Email doesn't exist" });
                return;
            }
            const token = generateResetPasswordToken(user._id);
            const mailSend = await sendResetPasswordMail(req, email, token);
            if (mailSend.status === "ok") {
                res.json({ status: 'ok' });
            } else {
                res.json({ status: 'error' });
            }
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    verifyResetPassword: async (req, res) => {
        try {
            const token = req.body?.token;
            const password = req.body?.password;
            if (!token) {
                return res.json({ status: 'error', message: 'Link is valid!, Please try again later!' });
            }
            const verify = verifyResetPasswordToken(token);
            if (verify?.status === "ok") {
                const user = await User.findOne({ _id: verify?.data?.id });
                if (!user) {
                    return res.json({ status: 'error', message: 'User not exist!' });
                };
                if (user.oauth) {
                    return res.json({ status: 'error', message: "Password can't be change" });
                }
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(password, salt);
                await User.findByIdAndUpdate(verify?.data?.id, { password: hash });
                res.json({ status: 'ok' });
            } else {
                return res.json({ status: 'error', message: 'Link is valid!, Please try again later!' });
            }
        } catch (error) {
            return res.json({ status: 'error', message: error?.message });
        }
    },
    getReferralCode: (req, res) => {
        const id = req.params?.id;
        if (!id) {
            return res.json({ status: 'error', message: 'User not exist!' });
        };
        const code = generateReferralCode(id);
        res.json({ status: "ok", data: { code } });
    },
    checkUserCanAddReview: async (req, res) => {
        const userId = req.query?.uId;
        const productId = req.query?.pId;
        try {
            const result = await Order.findOne({ userId, 'items.productId': productId, status: { $in: ["delivered", "return requested", "return cancelled", "request approved", "return rejected", "return recieved", "return accepted"] } });
            if (result) {
                res.json({ status: 'ok', data: { user: true } });
            } else {
                res.json({ status: 'ok', data: { user: false } });
            }
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    }
}