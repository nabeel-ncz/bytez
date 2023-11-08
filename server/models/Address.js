const mongoose = require('mongoose');
const AddressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    addresses: [{
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        companyName: {
            type: String,
        },
        houseAddress: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        zipcode: {
            type: String,
            required: true,
        },
        email: {
            type: String,
        },
        phone: {
            type: String,
            required: true,
        }
    }],
    defaultAddress: {
        type: String,
    }
});
const collection = mongoose.model("Address", AddressSchema);
module.exports = collection;