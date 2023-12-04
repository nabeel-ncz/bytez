const { ObjectId } = require("mongoose");
const { resizeProductImage } = require("../helper/imageResizeHelper");
const Product = require("../models/Product");
const Brand = require('../models/Brand');
const Category = require('../models/Category');
const uuid = require('uuid');
const slugify = require('slugify');

module.exports = {
    getAllProducts: async (req, res) => {
        try {
            const searchTerm = req.query?.search;
            const regexParts = searchTerm.split(/\s+/).map(part => `.*${part}.*`);
            const searchRegex = new RegExp(regexParts.join('|'), 'i');
            let filter = {};
            if (searchTerm && searchTerm !== "") {
                filter.$or = [
                    { title: { $regex: searchRegex } },
                    { tags: { $in: [searchRegex] } }
                ];
            };
            const page = Number(req.query?.page) || 1;
            const limit = Number(req.query?.limit) || 5;
            const skip = (page - 1) * limit;
            const products = await Product.find(filter).sort({ updatedAt: 'descending' }).skip(skip).limit(limit).lean();
            const totalDocuments = await Product.countDocuments(filter);
            if (!products || products.length === 0) {
                res.json({ status: "error", data: {}, message: "Products not found!" });
            } else {
                res.json({ status: "ok", data: { products, totalPage: Math.ceil(totalDocuments / limit) } });
            }
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        }
    },
    getAllProductsForUsers: async (req, res) => {
        const searchTerm = req.query?.search;
        const regexParts = searchTerm.split(/\s+/).map(part => `.*${part}.*`);
        const searchRegex = new RegExp(regexParts.join('|'), 'i');
        const queryCategory = req.query?.category;
        const queryBrand = req.query?.brand?.trim();
        const queryAvailability = req.query?.availability;
        const queryPriceFrom = req.query?.priceFrom;
        const queryPriceTo = req.query?.priceTo;
        const queryRating = req.query?.rating;

        console.log(queryCategory, queryBrand, queryAvailability, queryPriceFrom, queryPriceTo)

        let filter = {};
        if (searchTerm !== 'all') {
            filter.$or = [
                { title: { $regex: searchRegex } },
                { tags: { $in: [searchRegex] } }
            ];
        }
        if (queryCategory && queryCategory !== 'all') {
            const category = await Category.findOne({ category: queryCategory });
            filter.category = category._id;
        }
        if (queryBrand && queryBrand !== 'all') {
            const brand = await Brand.findOne({ brand: queryBrand });
            filter.brand = brand._id;
        }

        if (queryAvailability && queryAvailability === 'instock') {
            filter['varients.stockQuantity'] = { $gt: 0 };
        } else if (queryAvailability && queryAvailability === 'outofstock') {
            filter['varients.stockQuantity'] = { $lte: 0 };
        }

        if (queryPriceFrom) {
            filter['varients.discountPrice'] = { $gte: parseFloat(queryPriceFrom) };
        }

        if (queryPriceTo) {
            filter['varients.discountPrice'] = {
                ...filter['varients.discountPrice'],
                $lte: parseFloat(queryPriceTo)
            };
        }
        if (queryRating && queryRating !== 'all') {
            filter['totalRating'] = { $gte: parseFloat(queryRating) };
        }

        console.log(filter)

        try {
            const page = Number(req.query?.page) || 1;
            const limit = Number(req.query?.limit) || 8;
            const products = await Product.find(filter).limit(page * limit).populate('category brand').lean();
            if (!products || products.length === 0) {
                res.json({ status: "error", data: {}, message: "Products not found!" });
            } else {
                const filteredProducts = products.filter(product => {
                    const categoryStatus = product.category.status || "active";
                    const brandStatus = product.brand.status || "active";
                    return categoryStatus === "active" && brandStatus === "active";
                });
                res.json({ status: "ok", data: filteredProducts });
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
                const { title, category, brand, description, price, markup, discountPrice, stockQuantity, ramAndRom, color, status, tags
                } = req.body;
                const result = await resizeProductImage(req.files);
                let product = null;
                const slug = slugify(title, { replacement: '-', lower: true });

                if (result.status === "ok") {
                    const uniqueId = uuid.v4();
                    product = new Product({
                        title,
                        slug,
                        category,
                        brand,
                        tags,
                        varients: [
                            {
                                varientId: uniqueId,
                                description,
                                price,
                                markup,
                                discountPrice,
                                stockQuantity,
                                ramAndRom,
                                color,
                                status,
                                images: {
                                    mainImage: result?.data[0],
                                    subImages: result?.data.slice(1)
                                },
                            }
                        ],
                    });
                    const brandDetails = await Brand.findById(brand);
                    if (!brandDetails) {
                        return res.json({ status: 'error', messsage: 'Brand not exist!' });
                    };
                    if (brandDetails?.offerApplied) {
                        let offer = Math.floor(((product?.varients[0]?.discountPrice * brandDetails?.offerDiscount) / 100));
                        product.varients[0].discountPrice = product?.varients[0]?.discountPrice - offer;
                        product.varients[0].brandOffer = offer;
                    }
                    await product.save();
                    res.json({ status: "ok", data: product });
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
                ramAndRom, color, status, mainImageUpdated, subImagesUpdated, currThumbnail, currSubImages } = req.body;
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
                    "varients.$.ramAndRom": ramAndRom,
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
                const { productId, description, price, markup, discountPrice, stockQuantity, ramAndRom, color, status
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
                        ramAndRom,
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
        const variantId = req.query?.vId;
        try {
            const product = await Product.findById(productId);
            if (!product) {
                return res.json({ status: 'error', message: 'Product not found!' });
            }
            const specificVariant = product.varients.find((variant) => variant.varientId === variantId);
            if (!specificVariant) {
                return res.json({ status: 'error', message: 'Variant not found!' });
            }
            res.json({
                status: 'ok', data: {
                    title: product.title,
                    category: product.category,
                    brand: product.brand,
                    ...specificVariant._doc,
                }
            });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    getProductVarientAttributes: async (req, res) => {
        try {
            const productId = req.params?.id;
            const product = await Product.findById(productId);
            if (!product) {
                res.json({ status: 'error', message: 'Product not found!' });
            }
            const ramAndRomValues = new Set();
            product.varients.forEach((variant) => {
                ramAndRomValues.add(variant.ramAndRom);
            });
            const data = Array.from(ramAndRomValues);
            res.json({ status: 'ok', data: data });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    getProductVarientColors: async (req, res) => {
        try {
            const productId = req.params?.id;
            const product = await Product.findById(productId);
            if (!product) {
                res.json({ status: 'error', message: 'Product not found!' });
            }
            const availableColors = new Set();
            product.varients.forEach((variant) => {
                availableColors.add(variant.color);
            });
            const data = Array.from(availableColors);
            res.json({ status: 'ok', data: data });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    getProductVarientAttributesBasedOnColor: async (req, res) => {
        try {
            const productId = req?.query?.pId;
            const color = decodeURIComponent(req?.query?.color);
            const product = await Product.findById(productId);
            if (!product) {
                res.json({ status: 'error', message: 'Product not found!' });
            }
            const availableAttributes = new Set();
            product.varients.forEach((varient) => {
                if (varient.color === color) {
                    availableAttributes.add(varient.ramAndRom);
                };
            });
            const data = Array.from(availableAttributes);
            res.json({ status: "ok", data: data });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    getProductVarientColorsBasedOnRamAndRom: async (req, res) => {
        try {
            const productId = req?.query?.pId;
            const ramAndRom = decodeURIComponent(req?.query?.rr);
            const product = await Product.findById(productId);
            if (!product) {
                res.json({ status: 'error', message: 'Product not found!' });
            }
            const availableColors = new Set();
            product.varients.forEach((varient) => {
                if (varient.ramAndRom === ramAndRom) {
                    availableColors.add(varient.color);
                };
            });
            const data = Array.from(availableColors);
            res.json({ status: "ok", data: data });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    getProductIndexBasedOnColorAndId: async (req, res) => {
        try {
            const productId = req?.query?.pId;
            const color = decodeURIComponent(req?.query?.color);
            const product = await Product.findOne({
                _id: productId,
                'varients.color': color,
            });
            if (!product) {
                res.json({ status: 'error', message: 'product not found!' });
                return;
            }
            const index = product.varients.findIndex((varient) => varient.color === color);
            if (index === -1) {
                res.json({ status: 'error', message: 'product not found!' });
                return;
            }
            res.json({ status: 'ok', data: { varient: index } });

        } catch (error) {
            res.json({ status: "error", message: "Error finding product : " + error?.message });
        }
    },
    getProductIndexBasedOnAttributeAndId: async (req, res) => {
        try {
            const productId = req?.query?.pId;
            const ramAndRom = decodeURIComponent(req?.query?.rr);
            const color = decodeURIComponent(req?.query?.color);
            const product = await Product.findOne({
                _id: productId,
                'varients.ramAndRom': ramAndRom,
                'varients.color': color,
            });
            if (!product) {
                res.json({ status: 'error', message: 'product not found!' });
                return;
            }
            const index = product.varients.findIndex((varient) => varient.ramAndRom === ramAndRom && varient.color === color);
            if (index === -1) {
                res.json({ status: 'error', message: 'product not found!' });
                return;
            }
            res.json({ status: 'ok', data: { varient: index } });

        } catch (error) {
            res.json({ status: "error", message: "Error finding product : " + error?.message });
        }
    },
    updateProductMainField: async (req, res) => {
        const { id, title, category, brand, tags } = req.body;
        const slug = slugify(title, { replacement: '-', lower: true });
        try {
            const product = await Product.findById(id);
            const brandDetails = await Brand.findById(brand);
            if (!brandDetails) {
                return res.json({ status: 'error', messsage: 'Brand not exist!' });
            };
            if (brandDetails?.offerApplied) {
                product.varients?.forEach((item) => {
                    item.discountPrice += item.brandOffer;
                    const offer = Math.floor(((item.discountPrice * brandDetails?.offerDiscount) / 100));
                    item.discountPrice -= offer;
                    item.brandOffer = offer;
                })
            } else {
                product.varients?.forEach((item) => {
                    item.discountPrice += item.brandOffer;
                    item.brandOffer = 0;
                })
            }
            product.title = title;
            product.slug = slug;
            product.category = category;
            product.brand = brand;
            product.tags = tags;
            await product.save();
            // await Product.updateOne({ _id: id }, {
            //     $set: {
            //         title,
            //         slug,
            //         category,
            //         brand,
            //         tags
            //     }
            // });
            res.json({ status: "ok" });
        } catch (error) {
            res.json({ status: "error" });
        }
    },
    sampleController: async (req, res) => {
        try {
            // Find all products and populate the 'category' and 'brand' fields
            const products = await Product.find().populate('category brand').lean();

            if (!products || products.length === 0) {
                res.json({ status: "error", data: {}, message: "Products not found!" });
            } else {
                // Filter out products with blocked category or brand
                const filteredProducts = products.filter(product => {
                    // Check if the category and brand are not blocked
                    const categoryStatus = product.category.status || "active";
                    const brandStatus = product.brand.status || "active";

                    return categoryStatus === "active" && brandStatus === "active";
                });

                res.json({ status: "ok", data: filteredProducts });
            }
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        }
    },
    sampleControllerTwo: async (req, res) => {
        try {
            const q = 3;
            const productId = req?.query?.pId;
            const varientId = req?.query?.vId;

            res.json({ status: 'ok', data: product });
        } catch (error) {
            res.json({ status: 'error' });
        }
    },
    getProductsByBrand: async (req, res) => {
        try {
            const queryBrand = req.params?.brand;
            const products = await Product.aggregate([
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category',
                        foreignField: '_id',
                        as: 'category',
                    }
                },
                {
                    $unwind: "$category"
                },
                {
                    $lookup: {
                        from: 'brands',
                        localField: 'brand',
                        foreignField: '_id',
                        as: 'brand',
                    }
                },
                {
                    $unwind: "$brand"
                },
                {
                    $match: { "brand.brand": queryBrand }
                }
            ]);
            res.json({ status: 'ok', data: products });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
}