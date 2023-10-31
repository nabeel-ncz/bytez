const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    verifyEmail, 
    sendOtp,
    checkUserExist,
    logout
} = require('../controllers/userController');


router.post('/auth/signup', registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/verify/email', verifyEmail);
router.get('/auth/send_otp', sendOtp);
router.get('/auth/isExist', checkUserExist);
router.get('/auth/logout', logout);

module.exports = router;