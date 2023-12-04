const mongoose = require('mongoose');
const brandSchema = new mongoose.Schema({
    brand: {
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
    },
    offerApplied: {
        type: Boolean,
        default: false,
    },
    offerDiscount: {
        type: Number,
    },
    offerExpireAt: {
        type: Date,
    }
});
const collection = mongoose.model("Brand", brandSchema);
module.exports = collection;