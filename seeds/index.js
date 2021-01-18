const port = 3000; //define port
const express = require("express"); // require express
const path = require("path"); // require path module
const mongoose = require("mongoose"); // require mongoose
const Campground = require("../models/campground"); // require file where campground model is stored
const cities = require("./cities"); // import cities
const { places, descriptors } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

// checks if connection was successful
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});

// define funcition to return random element of array
const sample = (array) => array[Math.floor(Math.random() * array.length)];

// seed the database
const seedDB = async () => {
	// clear database
	await Campground.deleteMany({});
	for (let i = 0; i < 50; i++) {
		// choose a random city
		const random1000 = Math.floor(Math.random() * 1000);
		// generate random price
		const price = Math.floor(Math.random() * 20) + 10;
		// create a new campground from Model
		const camp = new Campground({
			location: `${cities[random1000].city}, ${cities[random1000].state}`, // assign random cities location
			title: `${sample(descriptors)} ${sample(places)}`,
			description:
				"Sit consequat elit ipsum dolore et nulla culpa dolore dolore mollit Lorem mollit excepteur.",
			price: price,
			author: "5ffff7c63e5ad2209db121b3",
			images: [
				{
					url:
						"https://res.cloudinary.com/ddiurydgo/image/upload/v1610968372/YelpCamp/cvhivhcar1ikoz1sy6j9.jpg",
					filename: "YelpCamp/cvhivhcar1ikoz1sy6j9",
				},
				{
					url:
						"https://res.cloudinary.com/ddiurydgo/image/upload/v1610968376/YelpCamp/nnnzwdi9zbqwzyya87ba.jpg",
					filename: "YelpCamp/nnnzwdi9zbqwzyya87ba",
				},
				{
					url:
						"https://res.cloudinary.com/ddiurydgo/image/upload/v1610968377/YelpCamp/cwzcgcma0ygmq7csjrl3.jpg",
					filename: "YelpCamp/cwzcgcma0ygmq7csjrl3",
				},
			],
		});
		await camp.save();
	}
};

seedDB().then(() => {
	console.log("Closing connection to database");
	mongoose.connection.close();
});
