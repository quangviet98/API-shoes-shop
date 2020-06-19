const express = require('express');
const router = express.Router();
const customerController = require('../../controllers/customer');
const checkAuth = require('../../middleware/checkAuth');

router.get('/', customerController.get_all_customer);
router.get('/currentPage=:currentPage&limitPerPage=:limitPerPage', customerController.get_customer_pagination);
router.get('/:id', customerController.get_one_customer);
router.patch('/reset/:id', checkAuth, customerController.patch_reset);
router.patch('/:id', checkAuth, customerController.patch_update);
router.post('/signup', customerController.post_signUp);
router.post('/signin', customerController.post_signin);

module.exports = router; 