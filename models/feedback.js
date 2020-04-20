const mongoose = require('mongoose');

const feedbackSchmema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    customerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Customer',
        required: true
    },
    content: {
        type: String,
        required: true
    }
},{versionKey: false})

module.exports = mongoose.model('Feedback', feedbackSchmema)