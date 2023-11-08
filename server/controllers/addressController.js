const Address = require('../models/Address');
const mongoose = require('mongoose')

module.exports = {
    createAddress: async (req, res) => {
        try {
            const {
                userId,
                firstName,
                lastName,
                companyName,
                houseAddress,
                country,
                state,
                city,
                zipcode,
                email,
                phone
            } = req.body;
            const exist = await Address.findOne({ userId });
            if (exist) {
                exist.addresses.push({
                    firstName, lastName, companyName, houseAddress, country, state, city, zipcode, email, phone
                });
                await exist.save();
            } else {
                const result = await Address.create({
                    userId: userId,
                    addresses: [{
                        firstName, lastName, companyName, houseAddress, country, state, city, zipcode, email, phone
                    }]
                });
                result.defaultAddress = result.addresses[0]._id;
                await result.save();
            }
            res.json({ status: 'ok' });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    changeDefaultAddress: async (req, res) => {
        const userId = req.query?.uId;
        const addressId = req.query?.aId;
        if (!userId || addressId) {
            return res.json({ status: 'error', message: 'Something went wrong!' });
        }
        try {
            await Address.findOneAndUpdate({ userId }, { defaultAddress: addressId });
            res.json({ status: 'ok' });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    getAllAddress: async (req, res) => {
        try {
            const userId = req.params?.id;
            const result = await Address.findOne({ userId });
            if (!result) {
                return res.json({ status: 'error', message: 'No Address Exist!' });
            }
            res.json({ status: 'ok', data: result });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    getAddress: async (req, res) => {
        const userId = req.query?.uId;
        const addressId = req.query?.aId;
        if (!userId || !addressId) {
            return res.json({ status: 'error', message: 'Something went wrong!' });
        }
        try {
            const response = await Address.findOne({ userId });
            if (!response) {
                return res.json({ status: 'error', message: 'No Address Exist' });
            }
            const address = response.addresses.find((doc) => doc._id.toString() === addressId);
            console.log(address)
            if (!address) {
                return res.json({ status: 'error', message: 'No Address found!' });
            }
            res.json({ status: 'ok', data: address });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    updateAddress: async (req, res) => {
        const {
            userId,
            addressId,
            firstName,
            lastName,
            companyName,
            houseAddress,
            country,
            state,
            city,
            zipcode,
            email,
            phone
        } = req.body;
        try {
            const result = await Address.findOneAndUpdate({ userId, "addresses._id": addressId },
                {
                    $set: {
                        'addresses.$.firstName': firstName,
                        'addresses.$.lastName': lastName,
                        'addresses.$.companyName': companyName,
                        'addresses.$.houseAddress': houseAddress,
                        'addresses.$.country': country,
                        'addresses.$.state': state,
                        'addresses.$.city': city,
                        'addresses.$.zipcode': zipcode,
                        'addresses.$.email': email,
                        'addresses.$.phone': phone,
                    }
                }, { new: true });
            if (!result) {
                return res.json({ status: 'error', message: 'Something went wrong!' });
            };
            res.json({ status: 'ok', data: result });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    deleteAddress: async (req, res) => {
        try {
            const userId = req.query?.uId;
            const addressId = req.query?.aId;
            const updated = await Address.findOneAndUpdate({ userId }, { $pull: { addresses: { _id: addressId } } }, { new: true });
            if (!updated) {
                return res.json({ status: 'error', message: 'Delete address failed!' });
            }
            res.json({ status: 'ok', data: updated });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    }
}