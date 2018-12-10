var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
    title: String,
    image: String,
    description : String,
    author : String,
    posted : Date,
    formated_date : String,
    comments : [
        {
            type:mongoose.Schema.Types.ObjectId, 
            ref: "Comment"
        }
    ]
    
});

module.exports = mongoose.model("posts", postSchema); 