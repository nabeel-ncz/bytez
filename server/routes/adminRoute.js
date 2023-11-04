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
    updateProductMainField
} = require('../controllers/productController');
const {
    createCategory,
    getAllCategories,
} = require('../controllers/categoryController');
const { 
    createBrand, 
    getAllBrands 
} = require('../controllers/brandController');

const { uploadFiles } = require('../helper/fileUploadHelper');



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

router.post('/category/create', createCategory);
router.get('/category/all', getAllCategories);

router.post('/brand/create', createBrand);
router.get('/brand/all', getAllBrands);

module.exports = router;