const { validationCampgroundSchema, reviewSchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError"); // require custom error class
const Campground = require("./models/campground"); // require file where campground model is stored
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		req.flash("error", "You must be logged in!");
		return res.redirect("/login"); // return to stop following code from running
	}
	next();
};

module.exports.validateCampground = (req, res, next) => {
	const { error } = validationCampgroundSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

module.exports.isAuthor = async (req, res, next) => {
	const { id } = req.params;
	const campground = await Campground.findById(id);
	if (!campground.author.equals(req.user._id)) {
		req.flash("error", "You do not have permission to do that!");
		return res.redirect(`/campground/${id}`);
	}
	next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
	const { id, reviewId } = req.params;
	const review = await Review.findById(reviewId);
	if (!review.author.equals(req.user._id)) {
		req.flash("error", "You do not have permission to do that!");
		return res.redirect(`/campground/${id}`);
	}
	next();
};

module.exports.validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		console.log(error.details);
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};
