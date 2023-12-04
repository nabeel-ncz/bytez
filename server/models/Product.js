const mongoose = require('mongoose');
const { Schema } = mongoose;
const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true,
        required: true,
    },
    category: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Category"
    },
    brand: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Brand"
    },
    varients: [
        {
            varientId: { type: String, required: true },
            description: { type: String, required: true },
            price: { type: Number, required: true },
            markup: { type: Number, required: true },
            discountPrice: { type: Number, required: true },
            stockQuantity: { type: Number, required: true },
            sold: { type: Number, default: 0 },
            ramAndRom: { type: String, required: true },
            color: { type: String, required: true },
            images: {
                mainImage: { type: String, required: true },
                subImages: [{ type: String }]
            },
            totalRating: { type: Number, default: 0 },
            status: { type: String, enum: ["publish", "unpublish"], required: true, default: "publish" },
            brandOffer: { type: Number, default: 0 }
        }
    ],
    tags: [{ type: String }],
    totalRating: { type: Number, default: 0 },
},
    {
        timestamps: true,
    })
const collection = mongoose.model("Product", productSchema);
module.exports = collection;