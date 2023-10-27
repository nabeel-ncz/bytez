const mongoose = require('mongoose');
const { Schema } = mongoose;
const productSchema = new Schema({
    title: {
        type:String,
        required:true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref:"Brand",
        required: true,
    },
    variants: [
        {
            description: {type: String, required: true},
            attributes: {
                ram: {type:String, required:true},
                storage: {type:String, required:true},
                colour: {type:String, required:true}
            },
            price:{type:Number, required:true},
            discountPrice:{type:Number, required:true},
            stockQuantity:{type:Number, required:true},
            sold:{type:Number, default: 0},
            images: {
                coverImage:{type:String, required: true},
                subImages:[{type:String}]
            },
            totalRating: {type:Number, default: 0},
            reviews: {type: Schema.Types.ObjectId, ref:"Review"}
        }
    ]
})
const collection = mongoose.model("Product", productSchema);
module.exports = collection;