const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyUser = (req, res, next) => {
    const token = req.cookies?.user_key;
    if (!token) {
        res.json({ status: 'error', message: "Token doesn't exist!" });
    } else {
        jwt.verify(token, process.env.USER_JWT_SECRET, (error, decoded) => {
            if (error) {
                res.json({ status: 'error', error: error?.message });
            } else {
                next();
            }
        });
    }
};
const isVerifiedAccount = (req, res, next) => {
    const token = req.cookies?.user_key;
    if (!token) {
        res.json({ status: 'error', message: "Token doesn't exist!" });
    } else {
        jwt.verify(token, process.env.USER_JWT_SECRET, async (error, decoded) => {
            if (error) {
                res.json({ status: 'error', message: error?.message });
            } else {
                const user = await User.findById(decoded.id);
                if (!user.verified) {
                    res.json({ status: 'error', message: "Account is not verified!" });
                } else {
                    next();
                }
            }
        });
    }
};
const verifyAdmin = (req, res, next) => {
    const token = req.cookies?.user_key;
    if (!token) {
        res.json({ status: 'error', message: "Token doesn't exist!" });
    } else {
        jwt.verify(token, process.env.USER_JWT_SECRET, async (error, decoded) => {
            if (error) {
                res.json({ status: 'error', error: error?.message });
            } else {
                const { id } = decoded;
                try {
                    const user = await User.findOne({ _id: id, role: "SuperAdmin" });
                    if (!user) {
                        res.json({ status: 'error', message: 'Authorization failed!' });
                    } else {
                        next();
                    }
                } catch (error) {
                    res.json({ status: 'error', message: error?.message });
                }
            }
        });
    }
};

module.exports = { verifyUser, verifyAdmin, isVerifiedAccount };