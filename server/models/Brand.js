const mongoose = require('mongoose');
const brandSchema = new mongoose.Schema({
    brand:{
        type:String,
        required: true,
        unique: true,
    },
    thumbnail:{
        type:String,
    }
})
const collection = mongoose.model("Brand", brandSchema);
module.exports = collection;