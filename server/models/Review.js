const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    comment: {
        type: String,
    },
    rating: {
        type: Number,
    }
},
    {
        timestamps: true
    }
);
const collection = mongoose.model("Review", reviewSchema);
module.exports = collection;