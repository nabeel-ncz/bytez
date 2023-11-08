const express = require('express');
const { 
    getAllProducts, 
    getProduct,
    getProductVarientAttributes,
    getProductVarientColors,
    getProductVarientAttributesBasedOnColor,
    getProductVarientColorsBasedOnRamAndRom,
    getProductIndexBasedOnColorAndId,
    getProductIndexBasedOnAttributeAndId
} = require('../controllers/productController');
const router = express.Router();

router.get('/store', getAllProducts);
router.get('/view/:id', getProduct);

router.get('/varient/available/color', getProductIndexBasedOnColorAndId);
router.get('/varient/available/attribute', getProductIndexBasedOnAttributeAndId);

router.get('/varient/attribute/available', getProductVarientAttributesBasedOnColor);
router.get('/varient/attribute/:id', getProductVarientAttributes);

router.get('/varient/color/available', getProductVarientColorsBasedOnRamAndRom);
router.get('/varient/color/:id', getProductVarientColors);

module.exports = router;