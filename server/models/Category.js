const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
    },
    status: {
        type: String,
        default: "active",
        enum: ['active', 'block']
    }
});
const collection = mongoose.model("Category", categorySchema);
module.exports = collection;