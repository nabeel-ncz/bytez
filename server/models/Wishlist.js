const mongoose = require('mongoose');
const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }]
})
const collection = mongoose.model("Wishlist", wishlistSchema);
module.exports = collection;