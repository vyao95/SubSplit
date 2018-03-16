var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

//Take our passportLocalMongoose package, that we required here and add a bunch of packages that come with that package to our UserSchema
//Hashing salting database
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);