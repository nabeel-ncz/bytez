const express = require('express');
const router = express.Router();
const googleStrategy = require('../config/googleAuth');
const passport = require('passport');
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
    verifyResetPassword,
    getReferralCode,
    checkUserCanAddReview
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
    makeRazorpayOrder,
    requestReturnOrder,
    cancelReturnRequest,
    cancelSingleProduct,
    returnSingleProduct,
    getOrderInvoiceData
} = require('../controllers/orderController');

const { 
    getAllTransactionsByUserId
} = require('../controllers/transactionController');

const {
    getWishlistItems,
    addItemsToWishlist,
    removeItemsFromWishlist,
    getWishlistDetails
} = require('../controllers/wishlistController');

const {
    getCarouselImagesForUser,
    getPosterImagesForUser
} = require('../controllers/bannerController');

const {
    getAvailabeUserCoupons,
    validateCoupon
} = require('../controllers/couponController');

const {
    applyCouponInCart,
    removeCouponFromCart
} = require('../controllers/cartController');

const {
    getProductReviews,
    addProductReview,
    updateProductReview,
    deleteProductReview,
    getReview,
} = require('../controllers/reviewController');

const { verifyUser, isVerifiedAccount } = require('../middleware/validate');
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
router.get('/product/get_review', getProductReviews);

router.use(verifyUser);

router.get('/cart/product/all/:id', getAllCartProducts);
router.post('/cart/product/add', addProductToCart);
router.patch('/cart/product/change_quantity', changeProductQuantity);
router.put('/cart/product/delete', deleteProductFromCart);
router.post('/cart/apply_coupon', applyCouponInCart)
router.patch('/cart/remove_coupon', removeCouponFromCart);
router.get('/cart/validate_coupon', validateCoupon)

router.get('/coupons/available/:id', getAvailabeUserCoupons);

router.get('/wishlist/all/:id', getWishlistItems);
router.post('/wishlist/add',addItemsToWishlist);
router.patch('/wishlist/delete',removeItemsFromWishlist);
router.get('/wishlist/details/:id', getWishlistDetails);

router.post('/profile/address/create', createAddress);
router.get('/profile/address/all/:id', getAllAddress);
router.get('/profile/address/find', getAddress);
router.patch('/profile/address/update', updateAddress);
router.patch('/profile/address/default', changeDefaultAddress);
router.patch('/profile/address/delete', deleteAddress);
router.patch('/profile/account/update', updateUserInform);
router.patch('/profile/account/update_password', updateUserPassword);

router.use(isVerifiedAccount);

router.post('/order/create', createOrder);
router.post('/order/payment/verify', verifyOrderPayment);
router.get('/order/all', getUserOrders);
router.get('/order/find/:id', getOrderById);
router.patch('/order/cancel', cancelOrder);
router.patch('/order/return', requestReturnOrder);
router.patch('/order/return/cancel', cancelReturnRequest);
router.put('/order/cancel_single',cancelSingleProduct);
router.put('/order/return_single',returnSingleProduct);
router.get('/order/invoice_data', getOrderInvoiceData);

router.get('/razorpay/key', getRazorpayKey);
router.post('/razorpay/create_order', makeRazorpayOrder)

router.get('/transaction/all', getAllTransactionsByUserId);
router.get('/referral_code/:id', getReferralCode)

router.get('/banner/carousel', getCarouselImagesForUser);
router.get('/banner/poster', getPosterImagesForUser);

router.get('/product/review', getReview);
router.get('/product/review/check', checkUserCanAddReview);
router.post('/product/add_review', addProductReview);
router.put('/product/update_review', updateProductReview);
router.delete('/product/delete_review', deleteProductReview);

module.exports = router;