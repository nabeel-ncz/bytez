const bcrypt = require('bcrypt');
const User = require('../models/User');
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
                const {otp, key} = generateOtpToken(result.data?.id);
                res.cookie("otp_key", key, { maxAge: 1000 * 60 * 2, httpOnly: true });
                await sendOtpMail({otp, email});
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
            const users = await User.find({role: "User"}).lean();
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
}