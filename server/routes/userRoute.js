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
    deleteProductFromCart,
    updateUserInform,
    updateUserPassword,
    resetPassword,
    verifyResetPassword
} = require('../controllers/userController');

const {
    createAddress,
    getAllAddress,
    getAddress,
    changeDefaultAddress,
    updateAddress,
    deleteAddress
} = require('../controllers/addressController');

const {
    createOrder,
    getUserOrders,
    getOrderById,
    cancelOrder,
    verifyOrderPayment,
    getRazorpayKey,
    makeRazorpayOrder
} = require('../controllers/orderController');

const { verifyUser } = require('../middleware/validate');
const { getAllActiveCategories } = require('../controllers/categoryController');
const { getAllActiveBrands } = require('../controllers/brandController');

router.use(passport.initialize());
router.use(passport.session());

router.post('/auth/signup', registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/verify/email', verifyEmail);
router.get('/auth/send_otp', sendOtp);
router.get('/auth/send_mail', resetPassword);
router.patch('/auth/verify/reset_password', verifyResetPassword);
router.get('/auth/isExist', checkUserExist);
router.get('/auth/logout', logout);

router.get('/oauth2/google',passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/oauth2/google/redirect', passport.authenticate('google',{ successRedirect:"/user/oauth2/google/success", failureRedirect:"/user/oauth2/google/failed" }));
router.get('/oauth2/google/success',googleAuthSuccess);
router.get('/oauth2/google/failed',googleAuthFailed);

router.get('/categories/all/active', getAllActiveCategories);
router.get('/brands/all/active', getAllActiveBrands);

router.use(verifyUser);

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
router.patch('/profile/account/update', updateUserInform);
router.patch('/profile/account/update_password', updateUserPassword);

router.post('/order/create', createOrder);
router.post('/order/payment/verify', verifyOrderPayment);
router.get('/order/all/:id', getUserOrders);
router.get('/order/find/:id', getOrderById);
router.get('/order/cancel/:id', cancelOrder);

router.get('/razorpay/key', getRazorpayKey);
router.post('/razorpay/create_order', makeRazorpayOrder)

module.exports = router;