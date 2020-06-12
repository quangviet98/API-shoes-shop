const mongoose = require('mongoose');

const billSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    customerID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Customer'
    },
    products: [{
        productID: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product'
        },
        quantity: { type: Number, required: true },
        price: Number
    }],
    total: Number,
    dateOrder: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Boolean,
        default: false
    },
    note: String
}, { versionKey: false })

module.exports = mongoose.model('Bill', billSchema);