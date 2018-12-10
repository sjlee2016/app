 var express = require("express");
 var request = require("request");
 var mongoose = require("mongoose");
 var bodyParser = require("body-parser");

 var moment = require('moment');

 mongoose.connect('mongodb://localhost:27017/blog');

 var Comment = require("./models/comment");

 var Post = require("./models/post");

 var seedDB = require("./seed");
 seedDB(); 
 var app = express();
 app.set("view engine" ,"ejs");
 app.use('/public', express.static('public'));
 app.use('/css', express.static('css'));
 app.use('/vendor', express.static('vendor'));
 app.use('/images', express.static('public/images'));
 app.use('/common-js', express.static('common-js'));
 app.use(bodyParser.urlencoded({extended:false}));
 app.use(express.json());

 app.get("/",function(req,res){
	res.render("default");
 });

 app.get("/blog", function(req,res){
	 return res.redirect('/blog/page/0');
 });

 app.get("/blog/page/:page", function(req,res)
 {
	var isEndPage = false;
	Post.find({})
	.sort({'posted' : -1 } )
	.skip(req.params.page * 5)
	.limit(5)
	.exec(function(err,posts){
		if(err){
			console.log("error finding posts");
		}else{
			if(posts.length < 5) {
				isEndPage = true;
			}
			res.render("blog", {
				posts:posts, 
				page: req.params.page,
				isEndPage: isEndPage
			});
		}
	});
}		
);
 app.get("/blog/post/:id/", function(req,res){
	 Post.findById(req.params.id).populate("comments").exec(function(err, post){
				if(err){
					console.log(err);
				}else{
					res.render("post", {post:post});
				}
			});
	
});
app.post("/comment/:id", function(req,res){
	var postid = req.params.id; 
	Post.findById(req.params.id, function(err,post){

	var timestamp = new Date();
	Comment.create(
		{
			posted: timestamp,
			formated_date: moment(timestamp).format('YYYY-MM-DD') ,
			text: req.body.comment,
			User: req.body.name,
			email: req.body.email
		}, function(err, comment){
			if(err){
				console.log(err);
			} else {
				post.comments.push(comment);
				post.save();
				res.redirect("/blog/post/"+ postid); 
			}
		});
});
});

 app.get("/resume", function(req,res){
 	res.render("resume");
});


 app.listen(3000, process.env.VIP, function(){

	console.log("server listening..");
 });
