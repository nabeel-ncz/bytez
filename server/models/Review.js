const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        required: true,
    },
    reviews: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            comment: {
                type: String,
            },
            rating: {
                type: Number,
            },
            createdAt:{
                type: Date,
                default: Date.now,
            },
            updatedAt:{
                type:Date,
            }
        }
    ],
})
const collection = mongoose.model("Review", reviewSchema);
module.exports = collection;