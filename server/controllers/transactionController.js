const Transaction = require('../models/Transaction');

module.exports = {
    getAllTransactionsByUserId: async (req, res) => {
        try {
            const userId = req.query?.id;
            const page = Number(req.query?.page) || 1;
            const limit = Number(req.query?.limit) || 5;
            const skip = (page - 1) * limit;
            const totalDocuments = await Transaction.countDocuments({ userId: userId });
            const transactions = await Transaction.find({ userId: userId }).sort({ updatedAt: 'descending' }).skip(skip).limit(limit);
            res.json({ status: 'ok', data: { transactions, totalPages: Math.ceil(totalDocuments / limit) } });
        } catch (error) {
            res.json({ status: 'errro', message: error?.message });
        }
    },
    getAllTransactions: async (req, res) => {
        try {
            const page = Number(req.query?.page) || 1;
            const limit = Number(req.query?.limit) || 5;
            const skip = (page - 1) * limit;
            const totalDocuments = await Transaction.countDocuments();
            const transactions = await Transaction.find({}).sort({ updatedAt: 'descending' }).skip(skip).limit(limit);
            res.json({ status: 'ok', data: { transactions, totalPages: Math.ceil(totalDocuments / limit) } })
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    }

}