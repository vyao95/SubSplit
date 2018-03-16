var express = require("express");
var router  = express.Router();
var Netflix = require("../models/netflix"); // Models
var Comment = require("../models/comment"); // Models
var middleware = require("../middleware");

// Grab all comments from the initial comments from seed.js
// Render New Comment Form
router.get("/netflix/:id/comments/new", middleware.isLoggedIn, function(req,res){
	//find Netfllix Group by ID
	Netflix.findById(req.params.id, function(err,netflix){
		if(err){
			console.log(err);
		}else{
			res.render("netflix/comments/new.ejs", {netflix,netflix});
		}
	});
});

// Lookup Netflix Group using ID, and SAVE the comment into /netflix/ID
router.post("/netflix/:id/comments", middleware.isLoggedIn, function(req,res){
   Netflix.findById(req.params.id, function(err,netflix){
           if(err){
              req.flash("error","Something went wrong");
              console.log(err);
           } else{
               Comment.create(req.body.comment, function(err,comment){ // Create comment
                   if(err){
                      console.log(err);
                  } else {
                     //add username and id to comment
                     comment.author.id = req.user._id;
                     comment.author.username = req.user.username;
                     //save comment
                     comment.save();
                     netflix.comments.push(comment._id); // Connect new comment to netflix group
                     netflix.save();
                     req.flash("success", "Successfully added comment");
                     res.redirect('/netflix/' + netflix._id); // Redirect to /netflix/id after adding in a comment
                 }
             });
          }
      });
});

// Comment Edit Route
router.get("/netflix/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
   Netflix.findById(req.params.id, function(err, netflix) {
       if(err || !netflix){
          req.flash("error", "No group found");
          return res.redirect("back");
       }
      Comment.findById(req.params.comment_id, function(err, foundComment) {
          if(err){
             res.redirect("back");
          } else{
              res.render("netflix/comments/edit.ejs", {netflix_id: req.params.id, comment: foundComment});
          }
      });
   });
});

// Comment Update Route
router.put("/netflix/:id/comments/:comment_id", middleware.checkCommentOwnership,  function(req,res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,updatedComment){
      if(err){
         res.redirect("back");
      } else {
         res.redirect("/netflix/" + req.params.id);
      }
   });
});

// Comment Destroy Route
router.delete("/netflix/:id/comments/:comment_id", middleware.checkCommentOwnership,  function(req,res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
      if(err){
         res.redirect("back");
      } else{
         req.flash("success", "Comment deleted");
         res.direct("/netflix/" + req.params.id);
      }
   });
});

module.exports = router;