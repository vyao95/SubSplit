var mongoose = require("mongoose");
var Netflix = require("./models/netflix")  //Take whatever is from the file netflix.js and import it here
var Comment = require("./models/comment"); //Take whatever is from the file comment.js and import it here

var data = [{
        name: "Silver Water Stormers!",
        image: "https://vegaspotheads.com/wp-content/themes/community-builder/assets/images/avatars/group-default-avatar.png",
        description: "Basic Plan $7.99, Looking for 1 person. Cannot be logged on the Netflix account the same time as me."
    },
    {
        name: "Stealth Chemical Doctors",
        image: "https://vegaspotheads.com/wp-content/themes/community-builder/assets/images/avatars/group-default-avatar.png",
        description: "Standard Plan $10.99, Looking for 1 person. Can login whenever."
    },
    {
        name: "Swishing Corsairs",
        image: "https://vegaspotheads.com/wp-content/themes/community-builder/assets/images/avatars/group-default-avatar.png",
        description: "Premium Plan $13.99, Looking for 3 people. Can login whenever."
    }
]

// Everytime server starts, execute this and have some placeholder data.
function seedDB() {
    //Remove all Netflix groups, just for testing purposes so I have data to mess with when server begins
    Netflix.remove({}, function(err) { // {} = all
        if (err) {
            console.log(err);
        }
        console.log("Removed Netflix Group(x3)");
        //Loop through 3 Netflix groups
        data.forEach(function(seed) {
            //name,image,description,comments,created(date), order appears inside show.ejs
            Netflix.create(seed, function(err, netflixdata) {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log("Added Netflix Group");
                    // create a comment, must match the schema defined in comment.js
                    Comment.create({ 
                        text: "This group is great, but I wish for sad reacts only",
                        author: "Jeffrey Hui"
                    }, function(err, comment) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            netflixdata.comments.push(comment); // add into database
                            netflixdata.save();                 // save into database
                            console.log("Created new comment");
                        }
                    });
                }
            });
        });
    });
}
// Seperate file, imported inside app.js
module.exports = seedDB;