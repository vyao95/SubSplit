var express 				= require("express"),			// Web Framework for Node.js
	app 					= express(),					// Shortcut for typing routes
    bodyParser  			= require("body-parser"),		// bodyParser is how we get data out of the form, the form sends data into the request body, and then we parse the request body using body parser.
    mongoose    			= require("mongoose"),			// MongoDB object modeling for node.js
    methodOverride			= require("method-override"),	// Allows the usage of HTTP post requests within forms, basically a way around it
    expressSanitizer		= require("express-sanitizer"),	// Prevent people from typing script tags inside your forms to break your code
    flash					= require("connect-flash"),		// UI
    seedDB					= require("./seeds"),			// Prepopulate Data into Website
    Netflix					= require("./models/netflix"),	// Netflix Schema
    Comment 				= require("./models/comment"),	// Comment Schema
    session					= require("express-session"),
	passport				= require("passport"),				  // Passport
	localStrategy			= require("passport-local"),
	passportLocalMongoose	= require("passport-local-mongoose"), // Gotta go fast w/ Auth
	User					= require("./models/user");
	app.locals.moment		= require("moment"); // Time created
	// requiring routes
	var commentRoutes = require("./routes/comments"),
		netflixRoutes = require("./routes/netflix"),
		indexRoutes   = require("./routes/index");

app.use(express.static(__dirname + "/public")); 				// Serve the content of the public directory, however, views will always be autoserved
app.use(bodyParser.urlencoded({ extended: true })); 			// Requiring bodyParser
app.use(expressSanitizer());									// So people cannot break your code if they type scripts
app.use(methodOverride("_method")); 							// Whenever you get a request that has _method as a paramater, take whatever it is equal to, PUT, GET, POST, PATCH, and treat that request as a PUT request 
app.use(flash());
// seedDB();													// Prepopulate Data into Website
mongoose.connect("mongodb://localhost/subscription_splitter");	// Create subscription_splitter database inside mongoDB.

// Cache Control
app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

// Passport Config
app.use(require("express-session")({ 
	secret:"lolidk",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize()); // Setting up Passport
app.use(passport.session());	// Setting up Passport

passport.use(new localStrategy(User.authenticate()));
// Reading the session, taking data from session that's encoded and unencoded it (deserializing it), and then encoding it (serializing it) and putting it back into session, comes from passportLocalMongoose, so don't have to do User.serialize
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// End of setup

// Ability to use currentUser, error, and succcess whereever I want in my application
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error       = req.flash("error");
	res.locals.success	   = req.flash("success");
	next();
});

// Using Routes
app.use(indexRoutes);
app.use(netflixRoutes);
app.use(commentRoutes);

// Tell Express to listen for requests on a specific server
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Subscription Splitter Server Has Started");
});



// //--------------------------------------------------HULU ROUTE BEGIN ---------------------------------------------
// app.get("/hulu", function(req, res) {
//     res.render("hulu/hulu.ejs"); // template, variable
// });
// //--------------------------------------------------HULU ROUTE END ------------------------------------------------

// //--------------------------------------------------HBO ROUTE BEGIN ---------------------------------------------
// app.get("/hbo", function(req, res) {
//     res.render("hbo/hbo.ejs"); // template, variable
// });
// //--------------------------------------------------HBO ROUTE END ------------------------------------------------

// //--------------------------------------------------Spotify ROUTE BEGIN ---------------------------------------------
// app.get("/spotify", function(req, res) {
//     res.render("spotify/spotify.ejs"); // template, variable
// });
// //--------------------------------------------------Spotify ROUTE END ------------------------------------------------

// //--------------------------------------------------Chegg ROUTE BEGIN ---------------------------------------------
// app.get("/chegg", function(req, res) {
//     res.render("chegg/chegg.ejs"); // template, variable
// });
// //--------------------------------------------------Chegg ROUTE END ------------------------------------------------

// //--------------------------------------------------YouTubeRed ROUTE BEGIN ---------------------------------------------
// app.get("/youtubered", function(req, res) {
//     res.render("youtubered/youtubered.ejs"); // template, variable
// });
// //--------------------------------------------------YouTubeRed ROUTE END ------------------------------------------------

// //--------------------------------------------------Apple Music ROUTE BEGIN ---------------------------------------------
// app.get("/applemusic", function(req, res) {
//     res.render("applemusic/applemusic.ejs"); // template, variable
// });
// //--------------------------------------------------Apple Music ROUTE END ------------------------------------------------

 // // Initialize Firebase
	//   var config = {
	//     apiKey: "AIzaSyAPVBW5cjFpxS7T4EBa4bJAeECnFHmj2cw",
	//     authDomain: "subscription-splitter.firebaseapp.com",
	//     databaseURL: "https://subscription-splitter.firebaseio.com",
	//     projectId: "subscription-splitter",
	//     storageBucket: "subscription-splitter.appspot.com",
	//     messagingSenderId: "379368007587"
	//   };
	//   firebase.initializeApp(config);
	// </script>
	// <!-- Facebook Login -->
	// <script>
	// 	var mongoose = require("mongoose");
	// 	var bodyParser = require("body-parser");
		
	// 	mongoose.connect("mongodb://localhost/subscription_splitter");
	// 	var userScheme = new mongoose.Schema({
	// 		fbId: String,
 //  	 		name: String,
 //   		email: String
	// 	});
	// 	var user = mongoose.model("user", userSchema);
		
	//   	window.fbAsyncInit = function() {
	//     	FB.init({
	//       		appId      : '1012334272248876',
	//      		 cookie     : true,
	//      		 xfbml      : true,
	//      		 version    : 'v2.12'
	//     	});
	//     	FB.getLoginStatus(function(response) {
	//     		statusChangeCallback(response);
	// 		});   
	//   	};
	// 	(function(d, s, id){
	//     	var js, fjs = d.getElementsByTagName(s)[0];
	//     	if (d.getElementById(id)) {return;}
	//     	js = d.createElement(s); js.id = id;
	//     	js.src = "https://connect.facebook.net/en_US/sdk.js";
	//     	fjs.parentNode.insertBefore(js, fjs);
	//     } (document, 'script', 'facebook-jssdk'));
	   
	//   	function statusChangeCallback(response){
	//      	if (response.status == 'connected'){
	//      		console.log("connected")
	//      		setElements(true);
	//      		requestAPI();
	//      	} else {
	//      		console.log("not connected")
	//      		setElements(false);
	//      	}
	//   	}
	//   	function checkLoginState() {
	//      	FB.getLoginStatus(function(response) {
	//     		statusChangeCallback(response);
	//      	});
	//   	}
	// 	function requestAPI(){
	// 	  FB.api('/me?fields=name,email,birthday', function(response){
	// 	    if(response && !response.error){
	// 	      console.log("working");
	// 	      var userId = response.id;
	// 	      var userName = response.name
	// 	      var userEmail = response.email;
	// 	      var newUserGroup = { fbId: userID, name: userName , email: userEmail }
	// 	      user.create(newUserGroup, function(err, newlyCreated){
	// 		    if(err){
	// 		        console.log(err);
	// 		    }
	// 	      });
	// 	    }
	// 	  })
	// 	}
	//   	function setElements(isLoggedIn){
	//   		if(isLoggedIn){
	//   			document.getElementById('fb-btn').style.display = 'none';
	//   			document.getElementById('logout').style.display = 'block';
	//   		} else {
	//   			document.getElementById('fb-btn').style.display = 'block';
	//   			document.getElementById('logout').style.display = 'none';
	//   		}
	//   	}
	//   	function logout(){
	//   		FB.logout(function(response){
	//   			setElements(false);
	//   		})
	//   	}
	// </script>
	
	//Passport for Facebook Login
	
	// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback

/*

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
*/