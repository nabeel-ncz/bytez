const User = require('../models/User');
const deleteUnverifiedUsers = async () => {
    const deletionThreshold = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
    try {
        const result = await User.deleteMany({
            verified: false,
            createdAt: { $lt: deletionThreshold },
        });
        console.log({ deletedCount: result.deletedCount });
    } catch (error) {
        console.log({ status: 'error', message: 'Internal Server Error' });
    }
}
module.exports = { deleteUnverifiedUsers };