const mongoose = require('mongoose');
const Type = require('../models/type');
const Product = require('../models/product');

exports.get_all_type = (req, res) => {
    Type.find()
        .exec()
        .then(result => {
            if (result.length > 0) {
                return res.status(200).json({
                    count: result.length,
                    data: result
                })
            }
            return res.status(404).json({
                message: 'does not exist any type!'
            })
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        })
}

exports.get_one_type = (req, res) => {
    const id = req.params.id;
    Type.findById(id)
        .exec()
        .then(result => {
            if (result) {
                return res.status(200).json({
                    type: result
                })
            }
            return res.status(404).json({
                message: 'type not found!'
            })
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        })
}

exports.post_insert = (req, res) => {
    let nametmp = req.body.name;
    name = nametmp.charAt(0).toUpperCase() + nametmp.substring(1);
    Type.findOne({ name: name })
        .exec()
        .then(result => {
            if (result) {
                return res.status(409).json({
                    message: 'type already exists!',
                    type: result
                })
            }
            const type = new Type({
                _id: mongoose.Types.ObjectId(),
                name
            })
            type.save()
                .then(result => {
                    return res.status(201).json({
                        message: 'created!',
                        type: result
                    })
                })
                .catch(err => {
                    return res.status(500).json({
                        error: err
                    })
                })
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        })
}

exports.delete_one = (req, res) => {
    const id = req.params.id;
    if (req.customerData.role === "admin") {
        Product.find({ typeID: id })
            .exec()
            .then(result => {
                if (result.length > 0) {
                    return res.status(409).json({
                        message: 'Foreign key conflict!'
                    })
                }
                Type.deleteOne({ _id: id })
                    .exec()
                    .then(result => {
                        return res.status(200).json({
                            message: 'deleted!',
                            result
                        })
                    })
                    .catch(err => {
                        return res.status(500).json({ error: err })
                    })
            })
            .catch(err => {
                return res.status(500).json({ error: err })
            })
    } else {
        return res.status(401).json({
            message: 'user is not authorized!'
        })
    }

}
exports.patch_update = (req, res) => {
    const id = req.params.id;

    Product.find({ typeID: id })
        .exec()
        .then(result => {
            if (result.length > 0) {
                return res.status(409).json({
                    message: 'Foreign key conflict!'
                })
            }
            const newName = req.body.newName;
            Type.updateOne({ _id: id }, { $set: { name: newName } }, function (err, raw) {
                if (err) {
                    return res.status(500).json({ error: err });
                }
                return res.status(200).json({
                    message: 'updated!',
                    raw
                })
            })
        })
        .catch(err => {
            return res.status(500).json({ error: err })
        })


}