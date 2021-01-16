const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground"); // require file where campground model is stored
const Review = require("../models/review");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");
const multer = require('multer');
const upload = multer({dest: 'uploads/'})

router
	.route("/")
	.get(catchAsync(campgrounds.index)) 									// show root page
	// .post(
	// 	isLoggedIn,
	// 	validateCampground,
	// 	catchAsync(campgrounds.createCampground)
	// ); 		
	.post(upload.array('image'), (req, res) => {
		console.log(req.body);
	})																// send POST request to add new campground

router.get("/new", isLoggedIn, campgrounds.renderNewForm); 					// show form to create new campground

router
	.route("/:id")
	.get(catchAsync(campgrounds.showCampground))							// search for specific campground by id and show it
	.put(
		isLoggedIn,
		isAuthor,
		validateCampground,
		catchAsync(campgrounds.updateCampground)
	) 																		 // update campground
	.delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground)); // delete campground

router.get(
	"/:id/edit",
	isLoggedIn,
	isAuthor,
	catchAsync(campgrounds.editCampground)
); 																			 // edit campground

module.exports = router;
