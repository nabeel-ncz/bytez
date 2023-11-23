const mongoose = require('mongoose');
const attributeSchema = new mongoose.Schema({
    ram: {
        type:Number,
    },
    rom: {
        type: Number,
        required: true,
    },
});
const collection = mongoose.model("Attributes", attributeSchema);
module.exports = collection;