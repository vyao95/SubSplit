var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");

// Landing Page
router.get("/", function(req, res) {
    res.render("index.ejs");   // Show Home Page
});

// Show register form
router.get("/register", function(req, res) {
   res.render("netflix/netflixgroups/register.ejs"); 
});

// Handling user sign up
router.post("/register", function(req, res) {
	// Passport Local Mongoose
	// Make a new user object that isnt saved to the DB and we only pass in username
	// req.body.passworD becomes a huge string of numbers and letters and stores into DB
	// If everything goes well, it will return a new user that has everything inside of it.
	User.register(new User({username: req.body.username}), req.body.password, function(err,user){
		if(err){
			return res.render('netflix/netflixgroups/register.ejs', {"error": err.message});
		}
		// Log the user in and run the serialize method above using the local strat
		passport.authenticate("local")(req,res,function(){
			req.flash("success", "Welcome to Subscription Splitter " + user.username);
			res.redirect("/netflix");
		});
	});
});

// Render the login page
router.get("/login", function(req, res) {
    res.render("netflix/netflixgroups/login.ejs");
});

// Middleware - does calculations in the middle before sent.
// Checks if there is already an existing account, if match login rn.
// It will use the method we didnt write, cus we use passport local mongoose package call authenticate which will take req.body.password,username and authenticate password
// with what we got stored in DB for that user.
router.post("/login", passport.authenticate("local",
	{
		successRedirect:"/netflix",
		failureRedirect:"/login"
	}), function (req, res){
});

// Destroy all user data in session
router.get("/logout", function(req,res){
	req.logout();	
	req.flash("success", "You Have Logged Out");
	res.redirect("/");
});

module.exports = router;