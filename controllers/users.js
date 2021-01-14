const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
	res.render("users/register");
}

module.exports.registerUser = async (req, res) => {
	try {
		const { email, username, password } = req.body;
		const user = new User({ email, username });
		const registeredUser = await User.register(user, password);
		req.login(registeredUser, (err) => {
			if (err) return next(err);
			req.flash("success", "Welcome to YelpCamp!");
			res.redirect("/campground");
		});
	} catch (e) {
		req.flash("error", e.message);
		res.redirect("register");
	}
}

module.exports.renderLogin = (req, res) => {
	res.render("users/login");
}

module.exports.login = (req, res) => {
    // passport handles authentication and failures automatically
    req.flash("success", "Welcome Back to Yelp Camp!");
    const redirectURL = req.session.returnTo || "/campground";
    delete req.session.returnTo;
    res.redirect(redirectURL);
}

module.exports.logout = (req, res) => {
	req.logout();
	req.flash("success", "Goodbye!");
	res.redirect("/campground");
}