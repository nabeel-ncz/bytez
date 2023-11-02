require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDb = require('./config/database');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const userRouter = require('./routes/userRoute');
const adminRouter = require('./routes/adminRoute');
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
app.use(session({secret:process.env.SESSION_SECRET, resave:true, saveUninitialized: true }));
app.use(cookieParser());
app.use('/products/resized', express.static(path.join(__dirname, "public", "products", "resized")));

app.use('/user', userRouter);
app.use('/admin', adminRouter);

app.listen(process.env.PORT || 3000, () => {
    console.log(`\x1b[30m\x1b[42mServer Running at ${process.env?.PORT} Port \x1b[0m`);
});