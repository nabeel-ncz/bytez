const Review = require('../models/Review');
const Product = require('../models/Product');

module.exports = {
    getProductReviews: async (req, res) => {
        try {
            const productId = req?.query?.pId;
            const result = await Review.find({ productId }).populate("userId")
            res.json({ status: 'ok', data: result });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    addProductReview: async (req, res) => {
        try {
            const { userId, productId, comment, rating } = req.body;
            const newReview = new Review({
                userId, productId, comment, rating
            });
            await newReview.save();
            const productReviews = await Review.find({ productId });
            const product = await Product.findById(productId);
            const totalRating = productReviews?.reduce((sum, item) => sum + item.rating, 0);
            product.totalRating = Math.floor((totalRating / productReviews.length) * 10) / 10;
            await product.save();
            res.json({ status: 'ok', data: newReview });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    updateProductReview: async (req, res) => {
        try {
            const { id, userId, productId, comment, rating } = req.body;
            const updated = await Review.updateOne({ _id: id }, { userId, productId, comment, rating }, { new: true });
            const productReviews = await Review.find({ productId });
            const product = await Product.findById(productId);
            const totalRating = productReviews?.reduce((sum, item) => sum + item.rating, 0);
            product.totalRating = Math.floor((totalRating / productReviews.length) * 10) / 10;
            await product.save();
            res.json({ status: 'ok', data: updated });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    deleteProductReview: async (req, res) => {
        try {
            const id = req?.query?.id;
            const productId = req?.query?.pId;
            const updated = await Review.deleteOne({ _id: id }, { new: true });
            const productReviews = await Review.find({ productId });
            const product = await Product.findById(productId);
            const totalRating = productReviews?.reduce((sum, item) => sum + item.rating, 0);
            product.totalRating = Math.floor((totalRating / productReviews.length) * 10) / 10;
            await product.save();
            res.json({ status: 'ok', data: updated });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    },
    getReview: async (req, res) => {
        try {
            const review = await Review.findById(req.query?.id);
            if (!review) {
                return res.json({ status: 'error', message: "Review not found!" });
            }
            res.json({ status: 'ok', data: review });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    }
}