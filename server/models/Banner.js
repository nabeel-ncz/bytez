const mongoose = require('mongoose');
const bannerSchema = new mongoose.Schema({
    image:{
        type: String,
        required: true,
    },
    isActive:{
        type: Boolean,
        default: true,
    }
});
const collection = mongoose.model("Banner", bannerSchema);
module.exports = collection;