var express = require("express");
var router  = express.Router();
var Netflix = require("../models/netflix"); // netflix.find stuff
var middleware = require("../middleware");
var Rating = require('../node_modules/rating');

// All Routes Below Follow The Convention of REST (Representational State Transfer) - a mapping between HTTP routes and CRUD (Create,READ,UPDATE,DESTROY)

// INDEX - Show all Netflix Groups
router.get("/netflix", function(req, res) {
    // Get all Netflix Groups from DB, seeds.js will display pre-set ones, otherwise it'll be empty and looks kinda bland.
    // index.ejs has name,image,description
    Netflix.find({}, function(err,allnetflix){ //Netflix refers to the model Schema defined inside netflix.js
        if(err){
            console.log(err);
        } else {
            res.render("netflix/netflixgroups/index.ejs", { netflixKappa: allnetflix, currentUser: req.user}); // Template, Variables
        }
    });
});

// CREATE - Add New Netflix Group to Database 
router.post("/netflix", middleware.isLoggedIn, function(req, res) {
	// Don't allow monkaS to type script tags inside my legendary form.
	req.body.nameS			= req.sanitize(req.body.nameS);
	req.body.imageS 		= req.sanitize(req.body.imageS);
    req.body.descriptionS   = req.sanitize(req.body.descriptionS);
    req.body.starratingS    = req.sanitize(req.body.starratingS);
    
    // Get data from form and add to netflix array, calculation after button has been pressed
    var namers = req.body.nameS; // request.body is an object because body-parser parsed it into a javascript obj
    var price  = req.body.price;
    var imagers = req.body.imageS;
    var descrips = req.body.descriptionS;
    var starratings = req.body.starratingS;
    var author = {
    	id: req.user._id,
    	username: req.user.username
    }
    
    // console.log(req.user);

	// name,image,description come from model schema in netflix.js
	// namers,imagers,descrips come from nameS,imageS,descriptionS in the new.ejs form, already parsed. 
    var newNetflixGroup = { name: namers, price: price, image: imagers, description: descrips,starrating: starratings, author:author}; // Make object
	// Once object has been parsed, send as a model via Netflix.create 
    Netflix.create(newNetflixGroup, function(err, newlyCreated){
    if(err){
        console.log(err);
    } else{
    	console.log(newlyCreated);
        res.redirect("/netflix"); // Redirect back to netflix page, default is a GET request even though we got two /netflix
    }
    });
});

// NEW - Send data to the post route, follows the REST idealogy 
// Show form to create new Netflix group
router.get("/netflix/new", middleware.isLoggedIn, function(req, res) {
    res.render("netflix/netflixgroups/new.ejs");
});

// SHOW - Show more info about the specific Netflix group
router.get("/netflix/:id", function(req,res){
	// Find Netflix group with provided ID, capture ID here
	Netflix.findById(req.params.id).populate("comments").exec(function(err,foundNetflixGroup){ // If found group ID
	if(err || !foundNetflixGroup){
		req.flash("error", "Group Not Found");
		res.redirect("back");
	}else{
		console.log(foundNetflixGroup);
		// Render show template with that netflix group
		res.render("netflix/netflixgroups/show.ejs", {netflixshow: foundNetflixGroup}); // Pass foundNetflixGroup, under the name netflixshow
	}
	});
});

// EDIT as a GET request for a specific ID(group) and show edit form
router.get("/netflix/:id/edit", middleware.checkGroupOwnership, function(req,res){
	Netflix.findById(req.params.id, function(err,editNetflixGroup){
		res.render("netflix/netflixgroups/edit.ejs", {netflixedit:editNetflixGroup}); // netflixedit inside edit.ejs
	});
});

// UPDATE as a PUT request for the Edit Route Form
router.put("/netflix/:id", middleware.checkGroupOwnership, function(req,res){
	var namers			= req.body.nameS; 
    var imagers 		= req.body.imageS;
    var descrips		= req.body.descriptionS;
    var price           = req.body.price;
    var starratings     = req.body.starratingS;
    var newNetflixGroup = { name: namers, price:price, image: imagers, description: descrips, starrating: starratings }; // Making an object
    
    // Prevent people from breaking your code with script tags
    req.body.nameS		= req.sanitize(req.body.nameS);
    req.body.imageS 	= req.sanitize(req.body.imageS);
    req.body.descripS	= req.sanitize(req.body.descripS);
    req.body.starratingS    = req.sanitize(req.body.starratingS);
	
	Netflix.findByIdAndUpdate(req.params.id, newNetflixGroup, function(err,updatedForm){
		if(err){
			res.redirect("/netflix");
		}else{
			res.redirect("/netflix/" + req.params.id); // Redirects back to that ID which has been updated. 
		}
	});
});

// Destroy Route as a POST request from show.ejs
router.delete("/netflix/:id", middleware.checkGroupOwnership, function(req,res){
	Netflix.findByIdAndRemove(req.params.id,function(err,deletedGroup){
	if(err){
		res.redirect("/");
	}else{
		res.redirect("/netflix/");
	}
	});	
});

module.exports = router;