const mongoose = require('mongoose');
const wishlistSchema = mongoose.Schema({

})

const collection = mongoose.model("Wishlist", wishlistSchema);
module.exports = collection;