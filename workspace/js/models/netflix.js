var mongoose = require("mongoose");

// Set up Netflix SCHEMA SETUP, 
var netflixSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    starrating: Number,
    author: {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                username: String
            },
    comments: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Comment"
                    }
               ],
    created: {
    			type: Date, 
    			default: Date.now
    		}
});

// Compile the SCHEMA into model, make me model that uses the above Schema that has a bunch of methods on it, so I can do things such as Netflix.find()
var Netflix = mongoose.model("Netflix", netflixSchema); // note the name of the model will become plural, Netflix -> Netflixes
module.exports = Netflix;