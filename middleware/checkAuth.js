const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_kEY || "secrect", function (err, decoded) {
            if (err) return res.status(401).json({
                error: err,
                message: 'Auth failed!'
            })
            req.customerData = decoded; // data chuyển qua controller 
            console.log("nexxt");

            next();
        })
    } else {
        return res.status(401).json({
            message: 'Auth failed!'
        })
    }
}