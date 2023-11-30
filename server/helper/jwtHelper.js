const jwt = require('jsonwebtoken');
const { generateOTP } = require('./otpHelper');
const generateUserToken = ({ id, isVerified }) => {
    return jwt.sign({ id, isVerified }, process.env.USER_JWT_SECRET, {
        expiresIn: 60 * 60 * 24 * 2
    });
}
const verifyUserToken = (token) => {
    return jwt.verify(token, process.env.USER_JWT_SECRET, (error, decoded) => {
        if (error) {
            return { status: "error", message: "Something error occured!" }
        } else {
            return { status: "ok", data: decoded };
        }
    })
}
const generateOtpToken = (userId) => {
    const OTP = generateOTP();
    const key = jwt.sign({ otp: OTP, userId: userId }, process.env.USER_OTP_SECRET, { expiresIn: 60 * 10 });
    return {
        otp: OTP,
        key: key,
    };
}
const verifyOtpToken = (otp, otpToken) => {
    return jwt.verify(otpToken, process.env.USER_OTP_SECRET, (error, decoded) => {
        if (error) {
            return { status: "error", message: "Something error occured!" }
        } else {
            if (otp === decoded.otp) {
                return { status: "ok", data: decoded }
            } else {
                return { status: "error", message: "OTP is not match!" }
            }
        }
    })
}
const generateResetPasswordToken = (id) => {
    return jwt.sign({ id }, process.env.USER_RESET_PASS_SECRET, {
        expiresIn: 60 * 10,
    });
}
const verifyResetPasswordToken = (token) => {
    return jwt.verify(token, process.env.USER_RESET_PASS_SECRET, (error, decoded) => {
        if (error) {
            return { status: "error", message: "Something error occured!" };
        } else {
            return { status: "ok", data: decoded };
        }
    })
}

module.exports = { 
    generateUserToken,
    generateOtpToken, 
    verifyOtpToken, 
    verifyUserToken, 
    generateResetPasswordToken,
    verifyResetPasswordToken 
}