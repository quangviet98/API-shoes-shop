const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const customerRoutes = require('./api/routes/customer');
const feedbackRoutes = require('./api/routes/feedback');
const typeRoutes = require('./api/routes/type');
const productRoutes = require('./api/routes/product');
const billRoutes = require('./api/routes/bill');

mongoose.connect(`mongodb+srv://viettrinh98:${process.env.pw}@shoes-shop-wiutx.mongodb.net/SHOES?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(
        console.log('connect success!')
    ).catch(err => {
        console.log(err);
    })
mongoose.Promise = global.Promise;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.use('/api/customers', customerRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/types', typeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/bills', billRoutes);

app.use((req, res, next) => {
    const error = new Error('URL not found!');
    error.status = 404;
    next(error);
})
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    })
})
module.exports = app