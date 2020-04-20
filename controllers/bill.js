const mongoose = require('mongoose');
const Bill = require('../models/bill');

exports.get_all_bill = (req, res) => {
    Bill.find()
        .populate([
            { path: 'customerID', select: '_id email name phone address' },
            { path: 'products.productID', select: '_id name price status' }
        ])
        .exec()
        .then(result => {
            if (result.length > 0) {
                return res.status(200).json({
                    count: result.length,
                    data: result
                })
            }
            return res.status(404).json({
                message: 'bills not found!'
            })
        })
        .catch(err => {
            return res.status(500).json({ error: err });
        })
}
exports.get_one_bill = (req, res) => {
    const id = req.params.id;
    Bill.findById(id)
        .populate([
            { path: 'customerID', select: '_id email name phone address' },
            { path: 'products.productID', select: '_id name price status' }
        ])
        .exec()
        .then(result => {
            if (!result) {
                return res.status(404).json({
                    message: 'bill not found!'
                })
            }
            return res.status(200).json({
                data: result
            })
        })
        .catch(err => {
            return res.status(500).json({ error: err });
        })
}

exports.get_bill_status = (req, res) => {
    const status = req.params.status;
    Bill.find({ status })
        .populate([
            { path: 'customerID', select: '_id email name phone address' },
            { path: 'products.productID', select: '_id name price status' }
        ])
        .exec()
        .then(result => {
            if (result.length > 0) {
                return res.status(200).json({
                    count: result.length,
                    data: result
                })
            }
            return res.status(404).json({
                message: 'bill not found!'
            })
        })
        .catch(err => {
            return res.status(500).json({ error: err });
        })
}

exports.post_insert = (req, res) => {
    const { customerID, products, total, status, note } = req.body;
    const bill = new Bill({
        _id: mongoose.Types.ObjectId(),
        customerID,
        products,
        total,
        status,
        note
    });
    bill.save()
        .then(result => {
            return res.status(201).json({
                message: 'created!',
                result
            })
        })
        .catch(err => {
            return res.status(500).json({ error: err });
        })
}
exports.patch_update = (req, res) => {
    const id = req.params.id;
    Bill.updateOne({ _id: id }, { $set: { status: false } }, function (err, raw) {
        if (err) {
            return res.status(500).json({ error: err });
        }
        return res.status(200).json({
            message: 'updated!',
            raw
        })
    })

}
exports.delete_one = (req, res) => {
    const id = req.params.id;
    if (req.customerData.role === "admin") {
        Bill.deleteOne({ _id: id })
            .then(result => {
                return res.status(200).json({
                    message: 'deleted!',
                    result
                })
            })
            .catch(err => {
                return res.status(500).json({ error: err });
            })
    } else {
        return res.status(401).json({
            message: 'user is not authorized!'
        })
    }

}