const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
        unique: true
    },
    typeID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Type'
    },
    price: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    photos: {
        type: Array,
        requied: true
    },
    material: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    description: String

}, { versionKey: false });

module.exports = mongoose.model('Product', productSchema);