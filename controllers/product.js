const mongoose = require('mongoose');
const Product = require('../models/product');
const fs = require('fs');


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

exports.get_products_status = (req, res)=>{
    const status = req.params.status;
    Product.find({status})
           .exec()
           .then(result=>{
               if(result.length>0){
                   return res.status(200).json({
                       count: result.length,
                       data: result
                   })
               }
               return res.status(404).json({
                   message: 'product not found!'
               })
           })
           .catch(err=>{
               return res.status(500).json({ error: err });
           })
}

exports.post_insert = (req, res) => {
    //console.log(req.body);
    const { name, typeID, price, color, material, status, description } = req.body;

    Product.findOne({ name })
        .exec()
        .then(result => {
            if (result) {
                return res.status(409).json({
                    message: 'prodcut already exists!'
                })
            }
            let photos = req.files.map((val, i) => val.path);

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
    var newUpdate={};    
    if(req.files.length>0){        
        newUpdate.photos = req.files.map((val,i)=>val.path);
    }    
    for(let key in req.body){
       if(req.body[key] !== undefined && req.body[key] !== ""){
        newUpdate[key] = req.body[key];
       }        
    }
    Product.updateOne({_id:id},{ $set : newUpdate}, function(err, raw) {
        if(err){
            return res.status(500).json({ error: err })
        }
        return res.status(200).json({
            message : 'updated!'
        })
        console.log(raw);
      })
    
}

exports.delete_one = (req, res)=>{
    const id = req.params.id;
    if(req.customerData.role ==="admin"){
        console.log('avsd');
        Product.updateOne({_id: id}, {$set: {status: false}}, function(err,raw) {
            if(err){
                return res.status(500).json({ error: err })
            }
            return res.status(200).json({
                message : 'status is changed to false!',
                raw
            })
        })
    }else{
        return res.status(401).json({
            message: 'user is not authorized!'
        }) 
    }
}