const Razorpay = require('razorpay');
const crypto = require('crypto');

const makeOnlinePayment = async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        const options = {
            amount: order.totalPrice,
            currency: 'INR',
            receipt: crypto.randomBytes(10).toString('hex')
        };
        instance.orders.create(options, (error, data) => {
            if (error) {
                res.json({ status: 'error', message: error?.message });
            }
            res.json({ status: 'ok', data: { order: order, payment: data } })
        })
    } catch (error) {
        return { status: 'error', message: error?.message }
    }
}

const verifyOnlinePayment = async (data) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(sign.toString()).digest('hex');
        if (expectedSign === razorpay_signature) {
            return { status: 'ok' };
        }
        return { status: 'error' };
    } catch (error) {
        return { status: 'error' };
    }
}

module.exports = { makeOnlinePayment }