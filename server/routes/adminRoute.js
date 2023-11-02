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
    updateProduct,
} = require('../controllers/productController');
const { uploadFiles } = require('../helper/fileUploadHelper');


router.get('/customer/all', getAllUsers);
router.patch('/customer/update/status', changeUserStatus);
router.get('/customer/:id', getUser);

router.get('/product/all', getAllProducts);
router.post('/product/create', uploadFiles, createProduct);
router.put('/product/update', updateProduct);
router.get('/product/:id', getProduct);

module.exports = router;