const express = require('express');
const router = express.Router();
const upload = require('../../middleware/multipleUploads');
const checkAuth = require('../../middleware/checkAuth');
const productController = require('../../controllers/product');


router.get('/', productController.get_all_products);
router.get('/:id', productController.get_one_product);
router.get('/status/:status', productController.get_products_status);
router.post('/', checkAuth, upload.array('photos',4),productController.post_insert);
router.patch('/:id', checkAuth, upload.array('photos',4), productController.patch_update_product);
router.delete('/:id', checkAuth, productController.delete_one);

module.exports = router;