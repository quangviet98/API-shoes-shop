const express = require('express');
const router = express.Router();
const customerController = require('../../controllers/customer');

router.get('/', customerController.get_all_customer);
router.get('/:id', customerController.get_one_customer);
router.post('/signup', customerController.post_signUp);
router.post('/signin', customerController.post_signin);

module.exports = router; 