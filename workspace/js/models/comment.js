var mongoose = require("mongoose");

//Define Schema Here
var commentSchema = mongoose.Schema({
    text: String,
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    created: {
    		type: Date, 
    		default: Date.now
    },
});

//Make it a Model
var Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;