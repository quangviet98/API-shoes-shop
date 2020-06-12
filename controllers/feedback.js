const mongoose = require('mongoose');
const Feedback = require('../models/feedback');
const Customer = require('../models/customer');


exports.get_all_feedback = (req, res, next) => {
    //console.log(__dirname);
    Feedback.find()
        .populate({ path: 'customerID', select: '_id email name phone address' })
        .exec()
        .then(result => {
            if (!result) {
                return res.status(404).json({
                    message: 'feedback not found!'
                })
            }
            return res.status(200).json({
                count: result.length,

                data: result.map((val, i) => {
                    return {
                        _id: val._id,
                        customer: val.customerID,
                        content: val.content
                    }
                })
            })
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        })
}
exports.get_one_feedback = (req, res, next) => {
    const id = req.params.id;
    Feedback.findById(id)
        .populate({ path: 'customerID', select: '_id email name phone address' })
        .exec()
        .then(feedback => {
            if (!feedback) {
                return res.status(404).json({
                    message: 'feedback not found!'
                })
            }
            return res.status(200).json({
                data: {
                    _id: feedback._id,
                    customer: feedback.customerID,
                    content: feedback.content
                }
            })
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        })
}
exports.get_pagination = (req, res) => {
    const { currentPage, limitPerPage } = req.params;
    console.log({ currentPage, limitPerPage });
    Feedback.find()
        .populate({ path: 'customerID', select: '_id email name phone address' })
        .exec()
        .then(result => {
            if (!result) {
                return res.status(404).json({
                    message: 'feedback not found!'
                })
            }
            const lastIndex = currentPage * limitPerPage;
            const firstIndex = lastIndex - limitPerPage;
            const data = result.slice(firstIndex, lastIndex);

            return res.status(200).json({
                totalItems: result.length,
                data: data.map((val, i) => {
                    return {
                        _id: val._id,
                        customer: val.customerID,
                        content: val.content
                    }
                })
            })
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        })
}
exports.post_insert = (req, res, next) => {
    const { id, email } = req.customerData;
    const { content } = req.body;

    const feedback = new Feedback({
        _id: mongoose.Types.ObjectId(),
        customerID: id,
        content
    })

    feedback.save()
        .then(result => {
            return res.status(200).json({
                message: 'created!',
                data: {
                    _id: result._id,
                    customerID: id,
                    email,
                    content
                }
            })
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        })
}

exports.delete_one = (req, res, next) => {
    const { id, role } = req.customerData;
    const feedbackID = req.params.id;

    if (role === 'admin') {
        Feedback.deleteOne({ _id: feedbackID })
            .then(result => {
                return res.status(200).json({
                    message: 'feedback has been deleted!',
                    result
                })
            })
            .catch(err => {
                return res.status(500).json({
                    error: err
                })
            })
    } else {
        return res.status(401).json({
            message: 'user is not authorized!'
        })
    }

}
