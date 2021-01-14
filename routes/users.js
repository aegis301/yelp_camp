const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const users = require("../controllers/users");

router
	.route("/register")
	.get(users.renderRegister) // render register form
	.post(catchAsync(users.registerUser)); // register new user

// login
router
	.route("/login")
	.get(users.renderLogin) // render login user form
	.post(
		passport.authenticate("local", {
			failureFlash: true,
			failureRedirect: "/login",
		}),
		users.login
	);

router.get("/logout", users.logout);

module.exports = router;
