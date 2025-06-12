const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utilis/wrapAsync.js");
const {reviewSchema} = require("../schema.js");
const expressError = require("../utilis/expressError.js");
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware.js');
const { addReviews, destroyReviews } = require('../controllers/reviews.js');
const reviewController = require('../controllers/reviews.js')

//Reviews
router.post('/',isLoggedIn, validateReview, wrapAsync(reviewController.addReviews));

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReviews));

module.exports = router;