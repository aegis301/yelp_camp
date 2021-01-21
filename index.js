if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const port = process.env.PORT ||3000; //define port
const express = require("express"); // require express
const path = require("path"); // require path module
const mongoose = require("mongoose"); // require mongoose
const Joi = require("joi"); // require joi for auth
const methodOverride = require("method-override"); // require m-o to get access to put and update req
const ejsMate = require("ejs-mate");
const session = require("express-session"); // include express sessions
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
// required utils
const ExpressError = require("./utils/ExpressError"); // require custom error class
// required models
const Campground = require("./models/campground"); // require file where campground model is stored
const Review = require("./models/review");
const User = require("./models/user");
const { validationCampgroundSchema, reviewSchema } = require("./schemas");
// required routes
const userRoutes = require("./routes/users");
const reviewRoutes = require("./routes/reviews");
const campgroundRoutes = require("./routes/campground");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");

const MongoDBStore = require("connect-mongo")(session);

const dbUrl = "mongodb://localhost:27017/yelp-camp";
// process.env.DB_URL ||
mongoose.connect(dbUrl, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

// checks if connection was successful
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});

const app = express(); // creates instance of express object to initialize the app

// standard config
app.engine("ejs", ejsMate); // use ejs-mate engine
app.set("view engine", "ejs"); // set view engine
app.set("views", path.join(__dirname, "views")); // use path module to tell express where to find views

app.use(express.urlencoded({ extended: true })); // tells express to parse the body in a post request
app.use(methodOverride("_method")); // create method-override
app.use(express.static(path.join(__dirname, "public"))); // serve static directories
app.use(mongoSanitize());
app.use(helmet({ contentSecurityPolicy: false }));

const scriptSrcUrls = [
	"https://stackpath.bootstrapcdn.com/",
	"https://api.tiles.mapbox.com/",
	"https://api.mapbox.com/",
	"https://kit.fontawesome.com/",
	"https://cdnjs.cloudflare.com/",
	"https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
	"https://kit-free.fontawesome.com/",
	"https://stackpath.bootstrapcdn.com/",
	"https://api.mapbox.com/",
	"https://api.tiles.mapbox.com/",
	"https://fonts.googleapis.com/",
	"https://use.fontawesome.com/",
];
const connectSrcUrls = [
	"https://api.mapbox.com/",
	"https://a.tiles.mapbox.com/",
	"https://b.tiles.mapbox.com/",
	"https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: [],
			connectSrc: ["'self'", ...connectSrcUrls],
			scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
			styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
			workerSrc: ["'self'", "blob:"],
			objectSrc: [],
			imgSrc: [
				"'self'",
				"blob:",
				"data:",
				"https://res.cloudinary.com/ddiurydgo/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
				"https://images.unsplash.com/",
			],
			fontSrc: ["'self'", ...fontSrcUrls],
		},
	})
);

const secret = process.env.SECRET || "thisshouldbeabettersecret"

const store = new MongoDBStore({
	url: dbUrl,
	secret: secret,
	touchAfter: 24 * 3600,
});

store.on("error", function (e) {
	console.log("SESSION STORE ERROR", e);
});

// setup express sessions
const sessionConfig = {
	store,
	name: "ycsession",
	secret: secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		// secure: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
};
app.use(session(sessionConfig));

// setup for flash (depends on sessions)
app.use(flash());

// setup for passport
app.use(passport.initialize());
app.use(passport.session()); // make passport use consistent sessions and not log in on every single request
passport.use(new LocalStrategy(User.authenticate())); // makes passport use local strategy and Model.authenticate() as authentication (all of that gets imported on installing the modules)

passport.serializeUser(User.serializeUser()); // specifies how to store user in the session
passport.deserializeUser(User.deserializeUser()); // specifies how to get rid of the user in the session

// middleware to set up stuff I have access to in every single template ('locals')
app.use((req, res, next) => {
	res.locals.currentUser = req.user; // makes currentUser available, user is added onto req by passport
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});

// enable routes
app.use("/", userRoutes);
app.use("/campground", campgroundRoutes);
app.use("/campground/:id/reviews", reviewRoutes);

// root route
app.get("/", (req, res) => {
	res.render("home");
});

// every route and request that could not have been handled
app.all("*", (req, res, next) => {
	next(new ExpressError("Page Not Found"), 404);
});

//error handling middleware
app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = "Something went wrong";
	res.status(statusCode).render("error", { err });
});

// server listen command
app.listen(port, () => {
	console.log(`SERVER LISTENING TO PORT ${port}`);
});
