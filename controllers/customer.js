const mongoose = require('mongoose');
const Customer = require('../models/customer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.get_all_customer = (req, res)=>{
    Customer.find()
        .exec()
        .then(result=>{
            if(result.length>0){
                return res.status(200).json({
                    count: result.length,
                    data: result
                })
            }
            return res.status(404).json({
                message: 'cutomers not found!'
            })
        })
        .catch(err=>{
            return res.status(500).json({ error: err })
        })
}

exports.get_one_customer = (req, res) =>{
    const id = req.params.id;
    Customer.findById(id)
            .exec()
            .then(result=>{
                if(!result){
                    return res.status(404).json({
                        message: 'customer not found!'
                    })
                }
                return res.status(200).json({
                    customer: result
                })
            })
            .catch(err=>{
                return res.status(500).json({ error: err });
            })
}
exports.post_signUp = (req, res) =>{
    //console.log(req.body);
    const {email, password, name, phone, address, role} = req.body;
    Customer.find({email : req.body.email})
            .exec()
            .then(customer => {
                if(customer.length > 0){
                    return res.status(409).json({ // conflict
                        message : 'email exist'
                    })
                }else{
                   
                    bcrypt.hash(password, 10 , (err, hash)=>{
                        if(err){
                            return res.status(500).json({
                                error : err
                            })
                        }else{
                            
                            const customer = new Customer({
                                _id : mongoose.Types.ObjectId(),
                                email : email,
                                password: hash,
                                name : name,
                                phone : phone,
                                address: address,
                                role : role
                            })
                            customer.save()
                                    .then(result=>{
                                        return res.status(201).json({
                                            data : result
                                        })
                                    })
                                    .catch(err=>{
                                        console.log('abc');
                                        return res.status(500).json({
                                            error: err
                                        })
                                    })
                        }
                   })                               
                }
            })
            .catch(err =>{
                return res.status(500).json({
                    error : err
                })
            })
}

exports.post_signin = (req, res, next) =>{
    const {email, password} = req.body;
    Customer.findOne({email})
            .exec()
            .then(customer => {
                if(customer){

                    bcrypt.compare(password,customer.password, function(err, result){
                        if(err){
                            return res.status(500).json({
                                error : err
                            })
                        }
                        if(result === true){
                            const payload = {
                                id : customer._id,
                                email,
                                role: customer.role                        
                            }
                            const token = jwt.sign(payload, process.env.JWT_KEY,{expiresIn : '24h'});
                            return res.status(200).json({
                                message: 'Auth success!',
                                token,
                                customer
                            })
                        }else{
                            return res.status(401).json({
                                message: 'Auth failed. Wrong password!'
                            })
                        }
                    })

                    
                }else{
                    return res.status(404).json({
                        message : 'Email not found!'
                    })
                }
            })
            .catch(err=>{
                return res.status(500).json({
                    error: err
                })
            })

}