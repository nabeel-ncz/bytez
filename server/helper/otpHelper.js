const generateOTP = () => {
    let OTP = '';
    const length = 6;
    for (let i = 0; i < length; i++) {
        const digit = Math.floor(Math.random() * 10).toString();
        OTP += digit;
    }
    console.log(OTP);
    return OTP;
}
module.exports = { generateOTP };