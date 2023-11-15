const mongoose = require('mongoose');
const orderTransaction = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    req.transactionSession = session;
    try {
        await next();
        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        console.error('Transaction aborted:', error);
        throw error;
    } finally {
        session.endSession();
    }
}

module.exports = { orderTransaction };