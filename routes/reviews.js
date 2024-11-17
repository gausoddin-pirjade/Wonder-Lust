const express = require('express');
const router = express.Router({mergeParams : true});
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isReviewAuthor } = require('../middleware.js');
const reviewController = require('../controllers/review.js');

//Post route
router.post('/', isLoggedIn, wrapAsync(reviewController.postReview));

//Delete post review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;