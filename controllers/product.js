const mongoose = require('mongoose');
const Product = require('../models/product');
const fs = require('fs');
const { response } = require('express');


exports.get_all_products = (req, res) => {
    Product.find()
        .populate({ path: "typeID", select: "_id name" })
        .exec()
        .then(result => {
            if (result.length == 0) {
                return res.status(404).json({
                    message: 'products not found!'
                })
            }
            return res.status(200).json({
                count: result.length,
                data: result
            })
        })
        .catch(err => {
            return res.status(500).json({ error: err })
        })

}

exports.get_one_product = (req, res) => {
    console.log('blll');
    const id = req.params.id;
    Product.findById(id)
        .populate({ path: "typeID", select: "_id name" })
        .exec()
        .then(result => {
            if (!result) {
                return res.status(404).json({
                    message: 'products not found!'
                })
            }
            return res.status(200).json({
                product: result
            })
        })
        .catch(err => {
            return res.status(500).json({ error: err })
        })
}

exports.get_products_status = (req, res) => {
    const status = req.params.status;
    Product.find({ status })
        .exec()
        .then(result => {
            if (result.length > 0) {
                return res.status(200).json({
                    count: result.length,
                    data: result
                })
            }
            return res.status(404).json({
                message: 'product not found!'
            })
        })
        .catch(err => {
            return res.status(500).json({ error: err });
        })
}

exports.get_pagination = async (req, res) => {
    const { currentPage, limitPerPage } = req.params;
    //const lastIndex = currentPage * limitPerPage;
    //const firstIndex = lastIndex - limitPerPage;

    const skipItems = (currentPage - 1) * limitPerPage;
    const limit = parseInt(limitPerPage);
    const total = await Product.countDocuments();


    Product.find()
        .populate({ path: "typeID", select: "_id name" })
        .skip(skipItems)
        .limit(limit)
        .exec()
        .then(result => {
            if (result.length == 0) {
                return res.status(404).json({
                    message: 'products not found!'
                })
            }

            //const data = result.slice(firstIndex, lastIndex);
            return res.status(200).json({
                count: total,
                data: result
            })
        })
        .catch(err => {
            return res.status(500).json({ error: err })
        })

}

exports.get_products_type = (req, res) => {
    const { typeID } = req.params;
    Product.find({ typeID })
        .populate({ path: "typeID", select: "_id name" })
        .exec()
        .then(result => {
            return res.status(200).json({
                count: result.length,
                data: result
            })
        })
        .catch(err => {
            return res.status(404).json({
                message: "not found"
            })
        })
}

exports.get_products_type_pagination = async (req, res) => {

    const { currentPage, limitPerPage, typeID } = req.params;
    //const lastIndex = currentPage * limitPerPage;
    //const firstIndex = lastIndex - limitPerPage;

    const skipItems = (currentPage - 1) * limitPerPage;
    const limit = parseInt(limitPerPage);

    const total = await Product.countDocuments({ typeID });

    Product.find({ typeID })
        .populate({ path: "typeID", select: "_id name" })
        .skip(skipItems)
        .limit(limit)
        .exec()
        .then(result => {
            return res.status(200).json({
                count: total,
                data: result
            })
        })
        .catch(err => {
            return res.status(404).json({
                message: "not found"
            })
        })
}

exports.get_products_type_search_pagination = async (req, res) => {
    const { currentPage, limitPerPage, typeID, search } = req.params;
    //const lastIndex = currentPage * limitPerPage;
    //const firstIndex = lastIndex - limitPerPage;
    const skipItems = (currentPage - 1) * limitPerPage;
    const limit = parseInt(limitPerPage);
    var regex = "";
    if (search) {
        regex = new RegExp(escapeRegex(search), 'gi');
    }

    const total = await Product.find({ typeID, name: regex }).countDocuments()


    console.log(total);
    Product.find({ typeID, name: regex })
        .populate({ path: "typeID", select: "_id name" })
        .skip(skipItems)
        .limit(limit)
        .exec()
        .then(result => {
            return res.status(200).json({
                count: total,
                data: result
            })
        })
        .catch(err => {
            return res.status(404).json({
                message: "not found"
            })
        })
}


exports.get_search_pagination = async (req, res) => {
    const { currentPage, limitPerPage, search } = req.params;
    //const lastIndex = currentPage * limitPerPage;
    //const firstIndex = lastIndex - limitPerPage;
    const skipItems = (currentPage - 1) * limitPerPage;
    const limit = parseInt(limitPerPage);
    var regex = "";
    if (search) {
        regex = new RegExp(escapeRegex(search), 'gi');
    }

    const total = await Product.find({ name: regex }).countDocuments()

    console.log('day la get_search_pagination');
    console.log(total);
    Product.find({ name: regex })
        .populate({ path: "typeID", select: "_id name" })
        .skip(skipItems)
        .limit(limit)
        .exec()
        .then(result => {
            return res.status(200).json({
                count: total,
                data: result
            })
        })
        .catch(err => {
            return res.status(404).json({
                message: "not found"
            })
        })
}





function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

exports.get_search = (req, res) => {
    var regex = "";
    if (req.params.search) {
        console.log('helo');
        regex = new RegExp(escapeRegex(req.params.search), 'gi');
    }

    Product.find({ name: regex })
        .populate({ path: "typeID", select: "_id name" })
        .exec()
        .then(result => {
            return res.status(200).json({
                count: result.length,
                data: result
            })
        })
        .catch(err => {
            return res.status(404).json({
                message: "not found"
            })
        })
}



exports.post_insert = (req, res) => {
    //console.log(req.body);
    const { name, typeID, price, color, material, status, description } = req.body;
    console.log(name, typeID, price, color, material, status, description);
    Product.findOne({ name })
        .exec()
        .then(result => {
            if (result) {
                return res.status(409).json({
                    message: 'prodcut already exists!'
                })
            }
            let photos = req.files.map((val, i) => val.path);
            console.log(photos);
            const product = new Product({
                _id: mongoose.Types.ObjectId(),
                name,
                typeID,
                price,
                color,
                photos,
                material,
                status,
                description
            });

            product.save()
                .then(result => {
                    return res.status(201).json({
                        message: 'created!',
                        product: result
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

exports.patch_update_product = (req, res) => {
    //const { name, typeID, price, color, material, status, description } = req.body;
    const id = req.params.id;
    var newUpdate = {};
    if (req.files.length > 0) {
        newUpdate.photos = req.files.map((val, i) => val.path);
    }
    for (let key in req.body) {
        if (req.body[key] !== undefined && req.body[key] !== "") {
            newUpdate[key] = req.body[key];
        }
    }
    Product.updateOne({ _id: id }, { $set: newUpdate }, function (err, raw) {
        if (err) {
            return res.status(500).json({ error: err })
        }
        return res.status(200).json({
            message: 'updated!'
        })
        console.log(raw);
    })

}

exports.delete_one = (req, res) => {
    const id = req.params.id;
    if (req.customerData.role === "admin") {
        console.log('avsd');
        Product.updateOne({ _id: id }, { $set: { status: false } }, function (err, raw) {
            if (err) {
                return res.status(500).json({ error: err })
            }
            return res.status(200).json({
                message: 'status is changed to false!',
                raw
            })
        })
    } else {
        return res.status(401).json({
            message: 'user is not authorized!'
        })
    }
}
