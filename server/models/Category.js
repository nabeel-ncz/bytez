const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    category:{
        type:String,
        required: true,
        unique: true,
    },
    thumbnail:{
        type:String,
    }
})
const collection = mongoose.model("Category", categorySchema);
module.exports = collection;