const { ObjectId } = require("mongoose");
const { resizeProductImage } = require("../helper/imageResizeHelper");
const Product = require("../models/Product");
const uuid = require('uuid');

module.exports = {
    getAllProducts: async (req, res) => {
        try {
            const products = await Product.find().lean();
            if (!products || products.length === 0) {
                res.json({ status: "error", data: {}, message: "Products not found!" });
            } else {
                res.json({ status: "ok", data: products });
            }
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        }
    },
    getProduct: async (req, res) => {
        const productId = req.params?.id;
        try {
            const product = await Product.findOne({ _id: productId });
            if (!product) {
                res.json({ status: "error", data: {}, message: "Product not found!" });
            } else {
                res.json({ status: "ok", data: product });
            }
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        }
    },
    createProduct: async (req, res) => {
        try {
            if (!req?.files) {
                res.json({ status: "error", message: "Image upload error!" });
            } else {
                const { title, category, brand, description, price, markup, discountPrice, stockQuantity, ram, rom, color, status
                } = req.body;
                const result = await resizeProductImage(req.files);
                let user = null;
                if (result.status === "ok") {
                    const uniqueId = uuid.v4();
                    user = await Product.create({
                        title,
                        category,
                        brand,
                        varients: [
                            {
                                varientId: uniqueId,
                                description,
                                price,
                                markup,
                                discountPrice,
                                stockQuantity,
                                ram,
                                rom,
                                color,
                                status,
                                images: {
                                    mainImage: result?.data[0],
                                    subImages: result?.data.slice(1)
                                },
                            }
                        ]
                    });
                    res.json({ status: "ok", data: user });
                } else {
                    res.json({ status: "error", message: "Image resize failed" });
                }
            }
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        }
    },
    updateProduct: () => {

    },
    updateProductVarient: async (req, res) => {
        try {
            const { productId, varientId, description, price, markup, discountPrice, stockQuantity,
                ram, rom, color, status, mainImageUpdated, subImagesUpdated, currThumbnail, currSubImages } = req.body;
            let result;
            if (req.files) {
                result = await resizeProductImage(req.files);
            }
            if (result?.status === "error") {
                res.json({ status: "error", message: "Image resize failed!" });
                return;
            }
            let updatedImages = {};
            let parsedSubImages = JSON.parse(currSubImages)
            if (mainImageUpdated) {
                updatedImages = { ...updatedImages, mainImage: result?.data[0] };
            } else {
                updatedImages = { ...updatedImages, mainImage: currThumbnail }
            }
            if (parsedSubImages) {
                updatedImages = { ...updatedImages, subImages: parsedSubImages };
            }
            if (subImagesUpdated && mainImageUpdated) {
                updatedImages = {
                    ...updatedImages, subImages: [
                        ...updatedImages.subImages,
                        ...result?.data?.slice(1)
                    ]
                };
            } else if (subImagesUpdated && !mainImageUpdated) {
                updatedImages = {
                    ...updatedImages, subImages: [
                        ...updatedImages.subImages,
                        ...result?.data
                    ]
                };
            }
            // console.log()
            const filter = {
                _id: productId,
                "varients.varientId": varientId,
            };
            const updateVarient = {
                $set: {
                    "varients.$.description": description,
                    "varients.$.price": price,
                    "varients.$.markup": markup,
                    "varients.$.discountPrice": discountPrice,
                    "varients.$.stockQuantity": stockQuantity,
                    "varients.$.ram": ram,
                    "varients.$.rom": rom,
                    "varients.$.color": color,
                    "varients.$.status": status,
                    "varients.$.images": updatedImages,
                }
            }
            const updatedProduct = await Product.findOneAndUpdate(filter, updateVarient, { new: true });
            if (updatedProduct) {
                res.json({ status: "ok" });
            } else {
                res.json({ status: "error", message: "Database error!" });
            }
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        }
    },

    createProductVarient: async (req, res) => {
        try {
            if (!req?.files) {
                res.json({ status: "error", message: "Image upload error!" });
            } else {
                const { productId, description, price, markup, discountPrice, stockQuantity, ram, rom, color, status
                } = req.body;
                const result = await resizeProductImage(req.files);
                if (result.status === "ok") {
                    const uniqueId = uuid.v4();
                    const newVarient = {
                        varientId: uniqueId,
                        description,
                        price,
                        markup,
                        discountPrice,
                        stockQuantity,
                        ram,
                        rom,
                        color,
                        status,
                        images: {
                            mainImage: result?.data[0],
                            subImages: result?.data.slice(1)
                        },
                    };
                    const updatedProduct = await Product.findByIdAndUpdate(productId, {
                        $push: { varients: newVarient }
                    }, { new: true });
                    if (updatedProduct) {
                        res.json({ status: "ok" });
                    } else {
                        res.json({ status: "error", message: "Database error!" });
                    }
                } else {
                    res.json({ status: "error", message: "Image resize failed" });
                }
            }
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        }
    },
    deleteProduct: async (req, res) => {
        const productId = req.query?.pId;
        const varientId = req.query?.vId;
        try {
            if (!productId || !varientId) {
                res.json({ status: "error", message: "Product Id or Varient Id is miss" });
            } else {
                const product = await Product.findOne({ _id: productId });
                if (!product) {
                    res.json({ status: "error", message: "Product Id is not exist" });
                } else {
                    if (product?.varients?.length > 1) {
                        const updatedDocument = await Product.findOneAndUpdate({ _id: productId }, {
                            $pull: { "varients": { varientId: varientId } }
                        }, { new: true });
                        res.json({ status: "ok", data: updatedDocument });
                    } else {
                        await Product.deleteOne({ _id: productId });
                        res.json({ status: "ok", data: null });
                    }
                }
            }
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        }
    },
    getProductVarient: async (req, res) => {
        const productId = req.query?.pId;
        const varientId = req.query?.vId;
        try {
            if (!productId || !varientId) {
                res.json({ status: "error", message: "Product Id or Varient Id is miss" });
            } else {
                const product = await Product.findOne({ _id: productId });
                if (!product) {
                    res.json({ status: "error", message: "Product Id is not exist" });
                } else {
                    const result = await Product.findOne({
                        _id: productId,
                        "varients.varientId": varientId,
                    }).exec();
                    if (!result) {
                        res.json({ status: "error", message: "Varient not exist" });
                    } else {
                        res.json({
                            status: "ok", data: {
                                title: product.title,
                                category: product.category,
                                brand: product.brand,
                                ...result?.varients[0]?._doc,
                            }
                        });
                    }
                }
            }
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        }
    },
    updateProductMainField: async (req, res) => {
        const { id, title, category, brand } = req.body;
        try {
            await Product.updateOne({ _id: id }, {
                $set: {
                    title,
                    category,
                    brand
                }
            });
            res.json({status:"ok"});
        } catch (error) {
            res.json({status:"error"});
        }
    }
}