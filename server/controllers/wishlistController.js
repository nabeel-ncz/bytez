const Wishlist = require('../models/Wishlist');
module.exports = {
    getWishlistItems: async (req, res) => {
        try {
            const userId = req.params?.id;
            const result = await Wishlist.findOne({ userId });
            res.status(200).json({ status: 'ok', data: result });
        } catch (error) {
            res.json({ status: 'error', message: error.message });
        }
    },
    addItemsToWishlist: async (req, res) => {
        try {
            const { userId, productId } = req.body;
            const result = await Wishlist.findOne({ userId });
            if (!result) {
                const newWishlist = new Wishlist({
                    userId: userId,
                    items: [productId]
                });
                await newWishlist.save();
                res.status(200).json({ status: 'ok', data: newWishlist });
            } else {
                const index = result.items.indexOf(productId);
                if (index === -1) {
                    result.items.push(productId);
                    await result.save();
                    res.status(200).json({ status: 'ok', data: result });
                } else {
                    res.json({ status: 'error', message: 'Product already exist in the wishlist' });
                }
            }
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    removeItemsFromWishlist: async (req, res) => {
        try {
            const { userId, productId } = req.body;
            const result = await Wishlist.findOne({ userId });
            if (result) {
                const index = result.items.indexOf(productId);
                if (index !== -1) {
                    result.items.splice(index, 1);
                    await result.save();
                    res.status(200).json({ status: 'ok', data: result });
                } else {
                    res.json({ status: 'error', message: 'Product not exist in the wishlist' });
                }
            } else {
                res.json({ status: 'error', message: 'Wishlist not found' });
            }
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    getWishlistDetails: async (req, res) => {
        try {
            const userId = req.params?.id;
            const result = await Wishlist.findOne({ userId }).populate('items');
            res.status(200).json({ status: 'ok', data: result });
        } catch (error) {
            res.json({ status: 'error', message: error.message });
        }
    }
}