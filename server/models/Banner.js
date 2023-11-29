const mongoose = require('mongoose');
const bannerSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['carousel', 'poster', 'news'],
        default: 'carousel',
    },
});
const collection = mongoose.model("Banner", bannerSchema);
module.exports = collection;