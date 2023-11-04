const mongoose = require('mongoose');
const { Schema } = mongoose;
const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true,
    },
    varients: [
        {
            varientId: {type: String, required: true},
            description: { type: String, required: true },
            price: { type: Number, required: true },
            markup: { type: Number, required: true },
            discountPrice: { type: Number, required: true },
            stockQuantity: { type: Number, required: true },
            sold: { type: Number, default: 0 },
            ram: { type: String, required: true },
            rom: { type: String, required: true },
            color: { type: String, required: true },
            images: {
                mainImage: { type: String, required: true },
                subImages: [{ type: String }]
            },
            totalRating: { type: Number, default: 0 },
            status:{ type: String, required: true, default: "draft" }
        }
    ]
},
    {
        timestamps: true,
})
const collection = mongoose.model("Product", productSchema);
module.exports = collection;