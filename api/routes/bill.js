const express = require('express');
const router = express.Router();
const checkAuth = require('../../middleware/checkAuth');
const billController = require('../../controllers/bill');

router.get('/', billController.get_all_bill);
router.get('/currentPage=:currentPage&limitPerPage=:limitPerPage', checkAuth, billController.get_bills_pagination);
router.get('/:id', billController.get_one_bill);
router.get('/status/:status', billController.get_bill_status); // get bill theo status
router.post('/', checkAuth, billController.post_insert);
router.patch('/:id', checkAuth, billController.patch_update);
router.delete('/:id', checkAuth, billController.delete_one);

module.exports = router; 