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
    googleAuthFailed,
    changeProductQuantity,
    addProductToCart,
    getAllCartProducts,
    deleteProductFromCart
} = require('../controllers/userController');

const {
    createAddress,
    getAllAddress,
    getAddress,
    changeDefaultAddress,
    updateAddress,
    deleteAddress
} = require('../controllers/addressController');

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

router.get('/cart/product/all/:id', getAllCartProducts);
router.post('/cart/product/add', addProductToCart);
router.patch('/cart/product/change_quantity', changeProductQuantity);
router.put('/cart/product/delete', deleteProductFromCart);

router.post('/profile/address/create', createAddress);
router.get('/profile/address/all/:id', getAllAddress);
router.get('/profile/address/find', getAddress);
router.patch('/profile/address/update', updateAddress);
router.patch('/profile/address/default', changeDefaultAddress);
router.patch('/profile/address/delete', deleteAddress);

module.exports = router;