const express = require('express');
const router = express();
const feedbackController = require('../../controllers/feedback');
const checkAuth = require('../../middleware/checkAuth');

router.get('/', feedbackController.get_all_feedback);

router.get('/currentPage=:currentPage&limitPerPage=:limitPerPage', checkAuth, feedbackController.get_pagination);
router.get('/:id', checkAuth, feedbackController.get_one_feedback);
router.post('/', checkAuth, feedbackController.post_insert);
router.delete('/:id', checkAuth, feedbackController.delete_one);

module.exports = router