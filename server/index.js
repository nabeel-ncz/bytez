require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDb = require('./config/database');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cron = require('node-cron');
const bodyParser = require('body-parser');
const userRouter = require('./routes/userRoute');
const adminRouter = require('./routes/adminRoute');
const productRouter = require('./routes/productRoute');
const { deleteUnverifiedUsers } = require('./cron/deleteUnverifiedUsers');
const { removeBrandOffer } = require('./cron/removeBrandOffer');
const app = express();
connectDb();

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../client/dist")));
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(cookieParser());
app.use('/products/resized', express.static(path.join(__dirname, "public", "products", "resized")));
app.use('/banners/resized', express.static(path.join(__dirname, "public", "banners", "resized")));
app.use('/uploads', express.static(path.join(__dirname, "public", "uploads")));

app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/products', productRouter);

cron.schedule('0 0 * * *', () => {
    deleteUnverifiedUsers();
    removeBrandOffer();
});
app.listen(process.env.PORT || 3000, () => {
    console.log(`\x1b[30m\x1b[42mServer Running at ${process.env?.PORT || 3000} Port \x1b[0m`);
});