const Campground = require("../models/campground");
const multer = require("multer");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
	// show index page
	const campgrounds = await Campground.find({});
	res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = async (req, res) => {
	// render form for new campground
	res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
	// create new campground
	const campground = new Campground(req.body.campground);
	// map images into object (create array of objects)
	campground.images = req.files.map((file) => ({
		url: file.path,
		filename: file.filename,
	}));
	campground.author = req.user._id;
	await campground.save();
	req.flash("success", "Successfully made a new campground!");
	res.redirect(`/campground/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
	// show certain campground
	const campground = await Campground.findById(req.params.id)
		.populate({
			path: "reviews",
			populate: {
				// use nested populate to populate the review's author
				path: "author",
			},
		})
		.populate("author");
	if (!campground) {
		req.flash("error", "Cannot find campground");
		return res.redirect("/campground");
	}
	res.render("campgrounds/show", { campground });
};

module.exports.editCampground = async (req, res) => {
	// render edit form for campground
	const campground = await Campground.findById(req.params.id);
	res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
	// edit existing campground and update info
	const { id } = req.params; // save out id to var
	const campground = await Campground.findByIdAndUpdate(id, {
		...req.body.campground,
	}); // use spread operator to pass in values to db\
	const imgs = req.files.map((file) => ({
		url: file.path,
		filename: file.filename,
	}));
	// map images into object (create array of objects)
	campground.images.push(...imgs);
	await campground.save();
	if (req.body.deleteImages) {
		for (let filename of req.body.deleteImages) {
			await cloudinary.uploader.destroy(filename);
		}
		await campground.updateOne({
			$pull: { images: { filename: { $in: req.body.deleteImages } } },
		});
	}
	req.flash("success", "Successfully updated campground!");
	res.redirect(`/campground/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
	// delete existing campground
	const { id } = req.params;
	await Campground.findByIdAndDelete(id);
	req.flash("success", "Successfully deleted campground");
	res.redirect("/campground");
};
