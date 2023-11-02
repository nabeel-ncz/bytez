const express = require('express');
const router = express.Router();
const passport = require('passport');
const googleStrategy = require('../config/googleAuth');
const {
    registerUser,
    loginUser,
    verifyEmail, 
    sendOtp,
    checkUserExist,
    logout,
    googleAuthSuccess,
    googleAuthFailed
} = require('../controllers/userController');

router.use(passport.initialize());
router.use(passport.session());

router.post('/auth/signup', registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/verify/email', verifyEmail);
router.get('/auth/send_otp', sendOtp);
router.get('/auth/isExist', checkUserExist);
router.get('/auth/logout', logout);

router.get('/oauth2/google',passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/oauth2/google/redirect', passport.authenticate('google',{ successRedirect:"/user/oauth2/google/success", failureRedirect:"/user/oauth2/google/failed" }));
router.get('/oauth2/google/success',googleAuthSuccess);
router.get('/oauth2/google/failed',googleAuthFailed)

module.exports = router;