const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
    getAllUsers,
    getUser,
    changeUserStatus,
} = require('../controllers/userController');

const {
    getAllProducts,
    getProduct,
    createProduct,
    createProductVarient,
    updateProduct,
    deleteProduct,
    getProductVarient,
    updateProductVarient,
    updateProductMainField,
} = require('../controllers/productController');
const {
    createCategory,
    getAllCategories,
    getCategory,
    updateCategory
} = require('../controllers/categoryController');
const {
    createBrand,
    getAllBrands,
    getBrand,
    updateBrand
} = require('../controllers/brandController');
const {
    createNewAttribute,
    getAllAttributes
} = require('../controllers/attributeController');
const {
    getAllOrders,
    updateOrderStatus,
    getSalesReport,
    getSalesReportByBrand
} = require('../controllers/orderController');
const {
    getAllCoupons,
    createCoupon,
    updateCoupon,
    getCouponDetails
} = require('../controllers/couponController');

const {
    getAllTransactions
} = require('../controllers/transactionController');

const {
    getAllBanners,
    createBanner,
    updateBanner,
    deleteBanner
} = require('../controllers/bannerController');

const { uploadFiles, uploadSingleFile } = require('../helper/fileUploadHelper');
const { verifyAdmin } = require('../middleware/validate');

router.use(verifyAdmin);

router.get('/dashboard/sales/:period', getSalesReport);
router.get('/dashboard/sales_by_brand/:brand', getSalesReportByBrand);
router.get('/customer/all', getAllUsers);
router.patch('/customer/update/status', changeUserStatus);
router.get('/customer/:id', getUser);

router.get('/product/all', getAllProducts);
router.get('/product/varient', getProductVarient);
router.post('/product/create', uploadFiles, createProduct);
router.post('/product/create/varient', uploadFiles, createProductVarient);
router.put('/product/update', updateProduct);
router.patch('/product/update/main', updateProductMainField);
router.put('/product/update/varient', uploadFiles, updateProductVarient);
router.delete('/product/delete', deleteProduct);
router.get('/product/:id', getProduct);

router.post('/category/create', uploadSingleFile, createCategory);
router.put('/category/update', uploadSingleFile, updateCategory);
router.get('/category/all', getAllCategories);
router.get('/category/:id', getCategory);

router.post('/brand/create', uploadSingleFile, createBrand);
router.put('/brand/update', uploadSingleFile, updateBrand);
router.get('/brand/all', getAllBrands);
router.get('/brand/:id', getBrand);

router.post('/attribute/create', createNewAttribute);
router.get('/attribute/all', getAllAttributes);

router.get('/order/all', getAllOrders);
router.patch('/order/update/status', updateOrderStatus);

router.get('/transactions/all', getAllTransactions);

router.get('/coupons/all', getAllCoupons);
router.post('/coupons/create', createCoupon);
router.patch('/coupons/update', updateCoupon);
router.get('/coupons/details/:id', getCouponDetails)

router.post('/banner/create', uploadSingleFile, createBanner);
router.patch('/banner/update', updateBanner);
router.delete('/banner/delete/:id', deleteBanner);
router.get('/banner/:type', getAllBanners);

module.exports = router;