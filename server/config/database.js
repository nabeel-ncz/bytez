const mongoose = require('mongoose');
const connect = () => {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log('\x1b[30m\x1b[44mDatabse Connected Successfully\x1b[0m')
    }).catch((err) => {
        console.log(`\x1b[30m\x1b[41m${err.message}\x1b[0m`)
    })
}
module.exports = connect;