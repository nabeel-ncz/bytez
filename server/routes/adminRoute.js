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
    getCategory
} = require('../controllers/categoryController');
const { 
    createBrand, 
    getAllBrands,
    getBrand
} = require('../controllers/brandController');
const {
    createNewAttribute,
    getAllAttributes
} = require('../controllers/attributeController');

const { uploadFiles, uploadSingleFile } = require('../helper/fileUploadHelper');



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
router.get('/category/all', getAllCategories);
router.get('/category/:id', getCategory);

router.post('/brand/create', uploadSingleFile, createBrand);
router.get('/brand/all', getAllBrands);
router.get('/brand/:id', getBrand);

router.post('/attribute/create', createNewAttribute);
router.get('/attribute/all', getAllAttributes);

module.exports = router;