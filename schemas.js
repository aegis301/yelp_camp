const Joi = require("joi");

module.exports.validationCampgroundSchema = Joi.object({
	campground: Joi.object({
		title: Joi.string().required(),
		price: Joi.number().required().min(0),
		description: Joi.string().required(),
		location: Joi.string().required(),
	}).required(),
	image: Joi.alternatives().try(Joi.array(), Joi.string()).allow(null).allow(''),
	deleteImages: Joi.array()
});


module.exports.reviewSchema = Joi.object({
	review: Joi.object({
			rating: Joi.number().required().min(1).max(5),
			reviewbody: Joi.string().required()
	}).required()
})