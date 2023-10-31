const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    phone:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["User", "Admin", "SuperAdmin"],
        default:"User",
    },
    isBlocked:{
        type:Boolean,
        default:false,
    },
    verified:{
        type:Boolean,
        default:false,
    },
    wallet:{
        type:Number,
    },
    createdAt:{
        type:Date,
        required:true,
    }
});
const collection = mongoose.model("User",userSchema);
module.exports = collection;