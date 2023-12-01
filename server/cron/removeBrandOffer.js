const Brand = require('../models/Brand');
const Product = require('../models/Product');

const removeBrandOffer = async () => {
    const currentDate = new Date(Date.now());
    try {
        const brands = await Brand.find({ offerApplied: true });
        brands.forEach(async (item) => {
            if (new Date(item.offerExpireAt) - currentDate < 0) {
                item.offerApplied = false;
                item.offerDiscount = null;
                item.offerExpireAt = null;
                const products = await Product.find({ brand: item._id });
                for (const product of products) {
                    if (product.varients && product.varients.length > 0) {
                        product.varients.forEach((item) => {
                            item.discountPrice = item.discountPrice + item.brandOffer;
                            item.brandOffer = 0;
                        });
                        await product.save();
                    }
                };
            }
        })
        await brands.save();
        console.log({ status: 'ok' });;
    } catch (error) {
        console.log({ status: 'error', message: 'Internal Server Error' });
    }
};

module.exports = { removeBrandOffer}