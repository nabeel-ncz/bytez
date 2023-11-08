const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            varientId: { type: String, required: true },
            quantity: { type: Number, required: true },
            name: { type: String, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            discountPrice: { type: Number, required: true },
            subTotal: { type: Number, required: true },
            attributes: {
                color: {type: String, required: true},
                ramAndRom: {type: String, required: true},
            },
        }
    ],
    subTotal: { type: Number, required: true },
    discount: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
}, {
    timestamps: true,
})

const collection = mongoose.model("Cart", cartSchema);
module.exports = collection;