const express = require('express');
const { getAllProducts, getProduct } = require('../controllers/productController');
const router = express.Router();

router.get('/store', getAllProducts);
router.get('/view/:id', getProduct);

module.exports = router;