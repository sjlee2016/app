var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    posted: Date,
    formated_date: String,
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Comment", commentSchema); 