const bcrypt = require('bcrypt');
const User = require('../models/User');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { generateUserToken, generateOtpToken, verifyOtpToken, verifyUserToken } = require('../helper/jwtHelper');
const { generateOTP } = require('../helper/otpHelper');
const { sendOtpMail } = require('../helper/mailHelper');

module.exports = {
    registerUser: async (req, res) => {
        const { name, email, password } = req.body;
        try {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            const currDate = Date.now();
            const user = await User.create({ name, email, password: hash, createdAt: currDate, wallet: 0 });
            if (!user) {
                res.json({ status: "error", message: "Something went wrong!" });
                return;
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
                    const response = await User.updateOne({ _id: result.data.userId }, { verified: true }, { new: true });
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
            const users = await User.find({ role: "User" }).lean();
            if (!users || users.length === 0) {
                res.json({ status: "error", data: {}, message: "Users not found!" });
            } else {
                res.json({ status: "ok", data: users });
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
            if (!exist) {
                await Cart.create({
                    userId: userId,
                    items: [{
                        productId: productId,
                        varientId: varient.varientId,
                        quantity: 1,
                        name: product.title,
                        image: varient.images.mainImage,
                        price: varient.price,
                        discountPrice: varient.discountPrice,
                        subTotal: varient.discountPrice,
                        attributes: {
                            color: varient.color,
                            ramAndRom: varient.ramAndRom,
                        },
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
                exist.items.push({
                    productId: productId,
                    varientId: varient.varientId,
                    quantity: 1,
                    name: product.title,
                    image: varient.images.mainImage,
                    discountPrice: varient.discountPrice,
                    price: varient.price,
                    subTotal: varient.discountPrice,
                    attributes: {
                        color: varient.color,
                        ramAndRom: varient.ramAndRom,
                    }
                });
                exist.subTotal += varient.price;
                exist.totalPrice += varient.discountPrice;
                exist.discount += (varient.price - varient.discountPrice);
                await exist.save();
                res.json({ status: 'ok' });
            }
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    getAllCartProducts: async (req, res) => {
        try {
            const userId = req?.params?.id;
            const result = await Cart.findOne({ userId });
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
            cart.items[itemIndex].subTotal = cart.items[itemIndex].quantity * cart.items[itemIndex].discountPrice;
            cart.subTotal = cart.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
            cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.quantity * item.discountPrice), 0);
            cart.discount = cart.subTotal - cart.totalPrice;
            const updatedCart = await cart.save();
            res.json({ status: 'ok', data: updatedCart });
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
            const subTotal = cart.subTotal - (itemToDelete.quantity * itemToDelete.price);
            const totalPrice = cart.totalPrice - (itemToDelete.quantity * itemToDelete.discountPrice);
            const discount = subTotal - totalPrice;
            const updatedItems = cart.items.filter((doc) => doc.varientId !== varientId);

            const updatedCart = await Cart.findOneAndUpdate({ userId }, {
                items: updatedItems,
                subTotal,
                totalPrice,
                discount,
            }, { new: true });

            res.json({ status: 'ok', data: updatedCart });
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
    }
}