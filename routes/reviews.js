const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground"); // require file where campground model is stored
const ExpressError = require("../utils/ExpressError"); // require custom error class
const Review = require("../models/review");
const { reviewSchema } = require("../schemas");
const catchAsync = require("../utils/catchAsync");
const reviews = require('../controllers/reviews');
const {
	validateReview,
	isLoggedIn,
	isAuthor,
	isReviewAuthor,
} = require("../middleware"); // require middleware

// add review
router.post(
	"/",
	isLoggedIn,
	validateReview,
	catchAsync(reviews.createReview)
);

// delete review
router.delete(
	"/:reviewId",
	isLoggedIn,
	isReviewAuthor,
	catchAsync(reviews.deleteReview)
);

module.exports = router;
