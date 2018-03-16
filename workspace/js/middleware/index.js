var middlewareObj = {};
var Netflix = require("../models/netflix"); // Require Netflix model
var Comment = require("../models/comment"); // Require Comment model

middlewareObj.checkGroupOwnership = function(req, res, next) {
	// Is User Logged In
	if (req.isAuthenticated()) {
		Netflix.findById(req.params.id, function(err, editNetflixGroup) {
			if (err || !editNetflixGroup) {
				req.flash("error", "Group not found");
				res.redirect("back");
				console.log(err);
			}
			else {
				// Does User Own Group?
				if (editNetflixGroup.author.id.equals(req.user._id)) {
					next();
				}
				else {
					req.flash("error", "You don't have permission to do so");
					res.redirect("back");
				}
			}
		});
	}
	else {
		// If not logged in, redirect back and say you need to be logged in to do this.
		res.redirect("back");
	}
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
	// Is User Logged In
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err || !foundComment) {
				req.flash("error", "Comment Not Found");
				res.redirect("back");
			}
			else {
				// Does User Own the Comment
				if (foundComment.author.id.equals(req.user._id)) {
					next();
				}
				else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	}
	else {
		// If not logged in, redirect back and say you need to be logged in to do this.
		req.flash("error", "You need to be logged in to do that"); //key and value, one time thing, no persistent
		res.redirect("back");
	}
};

middlewareObj.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next(); // If user is logged in, keep going move along (render whatever is next up)
	}
	req.flash("error", "You need to be logged in to do that"); //key and value, one time thing, no persistent
	res.redirect("/login");
};
module.exports = middlewareObj;