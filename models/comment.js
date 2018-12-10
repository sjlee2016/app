var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    posted: Date,
    formated_date: String,
    text: String,
    User: String,
    email: String
});

module.exports = mongoose.model("Comment", commentSchema); 