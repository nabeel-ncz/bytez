const { resizeProductImage } = require("../helper/imageResizeHelper");
const Product = require("../models/Product");

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
    getProduct: () => {

    },
    createProduct: async (req, res) => {
        try {
            if (!req?.files) {
                res.json({ status: "error", message: "Image upload error!" });
            } else {
                const { title, category, brand, description, price, markup, discountPrice, stockQuantity, ram, rom, color, status
                } = req.body;
                const result = await resizeProductImage(req.files);
                if (result.status === "ok") {
                    await Product.create({
                        title,
                        category,
                        brand,
                        variants: [
                            {
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
                    res.json({status:"ok"});
                } else {
                    res.json({status:"error", message:"Image resize failed"});
                }
            }
        } catch (error) {
            res.json({status:"error", message: error?.message});
        }
    },
    updateProduct: () => {

    }
}