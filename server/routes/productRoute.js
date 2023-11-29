const express = require('express');
const {  
    getProduct,
    getProductVarientAttributes,
    getProductVarientColors,
    getProductVarientAttributesBasedOnColor,
    getProductVarientColorsBasedOnRamAndRom,
    getProductIndexBasedOnColorAndId,
    getProductIndexBasedOnAttributeAndId,
    getProductVarient,
    getAllProductsForUsers,
    sampleControllerTwo,
    getProductsByBrand
} = require('../controllers/productController');
const router = express.Router();


router.get('/sample', sampleControllerTwo)

router.get('/store', getAllProductsForUsers);
router.get('/view/:id', getProduct);
router.get('/varient/view', getProductVarient);
router.get('/:brand', getProductsByBrand)

router.get('/varient/available/color', getProductIndexBasedOnColorAndId);
router.get('/varient/available/attribute', getProductIndexBasedOnAttributeAndId);

router.get('/varient/attribute/available', getProductVarientAttributesBasedOnColor);
router.get('/varient/attribute/:id', getProductVarientAttributes);

router.get('/varient/color/available', getProductVarientColorsBasedOnRamAndRom);
router.get('/varient/color/:id', getProductVarientColors);



module.exports = router;