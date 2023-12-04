const Brand = require('../models/Brand');
const Product = require('../models/Product');

module.exports = {
    createBrand: async (req, res) => {
        try {
            const filename = req?.file?.filename;
            const { brand, status, offerApplied, offerDiscount, offerExpireAt } = req.body;
            if (!filename) {
                res.json({ status: "error", messsage: "Image upload error!" });
                return;
            }
            const isExist = await Brand.findOne({ brand: brand.toLowerCase(), status: "active" });
            if (isExist) {
                return res.json({ status: 'error', message: 'Brand is already exist' });
            }
            const extraField = offerApplied ? { offerApplied, offerDiscount, offerExpireAt } : {};
            const newBrand = new Brand({
                brand: brand.toLowerCase(),
                thumbnail: filename, 
                status,
                ...extraField,
            });
            newBrand.save();
            res.json({ status: "ok" });
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        }
    },
    updateBrand: async (req, res) => {
        try {
            const filename = req?.file?.filename;
            const { id, brand, fileChanged, status, offerApplied, offerDiscount, offerExpireAt } = req.body;
            const isExist = await Brand.findOne({ brand: brand.toLowerCase(), status: "active" });
            if (isExist && isExist._id.toString() !== id) {
                return res.json({ status: 'error', message: 'Brand is already exist' });
            };
            let updateFields = {};
            if (offerApplied === "true") {
                updateFields = { offerApplied, offerDiscount, offerExpireAt };
                //updating the products
                const products = await Product.find({ brand: id });
                for (const product of products) {
                    if (product.varients && product.varients.length > 0) {
                        product.varients.forEach((item) => {
                            item.discountPrice = item.discountPrice + item.brandOffer;
                            const discount = Math.floor((item.discountPrice * offerDiscount) / 100);
                            item.discountPrice = item.discountPrice - discount;
                            item.brandOffer = discount;
                        });
                        await product.save();
                    }
                }
            } else {
                updateFields = { offerApplied, offerDiscount: null, offerExpireAt: null };
                const existBrand = await Brand.findById(id);
                if (existBrand?.offerApplied) {
                    //update products
                    const products = await Product.find({ brand: id });
                    for (const product of products) {
                        if (product.varients && product.varients.length > 0) {
                            product.varients.forEach((item) => {
                                item.discountPrice = item.discountPrice + item.brandOffer;
                                item.brandOffer = 0;
                            });
                            await product.save();
                        }
                    }
                }

            };
            updateFields = { ...updateFields, brand: brand.toLowerCase(), status };
            if (fileChanged) {
                updateFields = { ...updateFields, thumbnail: filename };
            };
            await Brand.findByIdAndUpdate(id, { $set: { ...updateFields } });
            res.json({ status: "ok" });
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        }
    },
    updateBrandStatus: async (req, res) => {
        try {
            const id = req?.query?.id;
            const status = req?.query?.status;
            if (!id || !status) {
                res.json({ status: "error", message: "Brand is not found!" });
            } else {
                await Brand.updateOne({ _id: id }, { isBlocked: status });
                res.json({ status: "ok" });
            }
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        }
    },
    getAllBrands: async (req, res) => {
        try {
            const result = await Brand.find({}).lean();
            if (!result) {
                res.json({ staus: "error", message: "Brand not found!" });
            } else {
                res.json({ status: "ok", data: result });
            }
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        }
    },
    getBrand: async (req, res) => {
        try {
            const id = req?.params?.id;
            const result = await Brand.findOne({ _id: id });
            if (!result) {
                res.json({ status: "error", message: "Brand not found!" });
            } else {
                res.json({ status: "ok", data: result });
            }
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        }
    },
    getAllActiveBrands: async (req, res) => {
        try {
            const result = await Brand.find({ status: 'active' }).lean();
            if (!result) {
                res.json({ staus: "error", message: "Brand not found!" });
            } else {
                res.json({ status: "ok", data: result });
            }
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        }
    }
}