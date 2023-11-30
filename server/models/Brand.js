const mongoose = require('mongoose');
const brandSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true,
        unique: true,
        collation: { locale: 'en', strength: 2 },
    },
    thumbnail: {
        type: String,
    },
    status: {
        type: String,
        default: "active",
        enum: ['active', 'block']
    },
    offerApplied: {
        type: Boolean,
        default: false,
    },
    offerDiscount: {
        type: Number,
    },
    offerExpireFrom: {
        type: Date,
    },
    offerExpireTo: {
        type: Date,
    }
});
const collection = mongoose.model("Brand", brandSchema);
module.exports = collection;