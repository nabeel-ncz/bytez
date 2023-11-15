const mongoose = require('mongoose');
const brandSchema = new mongoose.Schema({
    brand:{
        type:String,
        required: true,
        unique: true,
    },
    thumbnail:{
        type:String,
    },
    status: {
        type: String,
        default: "active",
        enum: ['active', 'block']
    }
})
const collection = mongoose.model("Brand", brandSchema);
module.exports = collection;