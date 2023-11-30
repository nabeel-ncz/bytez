const jwt = require('jsonwebtoken');

const generateReferralCode = (id) => {
    return jwt.sign({ id }, process.env.REFERRAL_SECRET, { algorithm:'HS256'});
};

const validateRefferalCode = (token) => {
    return jwt.verify(token, process.env.REFERRAL_SECRET, (err, decoded) => {
        if (err) {
            return null;
        } else {
            return decoded;
        }
    });
};

module.exports = { validateRefferalCode, generateReferralCode };
