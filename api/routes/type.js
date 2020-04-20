const express = require('express');
const router = express.Router();
const checkAuth = require('../../middleware/checkAuth');
const typeConstroller = require('../../controllers/type');

router.get('/', typeConstroller.get_all_type);
router.get('/:id', typeConstroller.get_one_type);
router.post('/', checkAuth, typeConstroller.post_insert);
router.delete('/:id', checkAuth, typeConstroller.delete_one);
router.patch('/:id', checkAuth, typeConstroller.patch_update);

module.exports = router;