const mongoose = require('mongoose');
const AddressSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    address:{
        type:[{
            firstName:{
                type:String,
                required:true,
            },
            lastName:{
                type:String,
                required:true,
            },
            houseAddress:{
                type:String,
                required:true,
            },
            country:{
                type:String,
                required:true,
            },
            city:{
                type:String,
                required:true,
            },
            zipcode:{
                type:String,
                required:true,
            },
            email:{
                type:String,
                required:true,
            },
            phone:{
                type:String,
                required:true,
            }
        }],
        default:[],
    },
});
const collection = mongoose.model("Address",AddressSchema);
module.exports = collection;