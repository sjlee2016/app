 var express = require("express");
 var request = require("request");
 var mongoose = require("mongoose");
 var bodyParser = require("body-parser");
 var app = express();

 app.set("view engine" ,"ejs");
 app.use('/public', express.static('public'));
 app.use('/css', express.static('css'));
 app.use('/vendor', express.static('vendor'));
 app.use('/images', express.static('public/images'));
 app.use('/common-js', express.static('common-js'));
 app.use(bodyParser.urlencoded({extended:false}));
 app.use(express.json());
 mongoose.connect('mongodb://localhost:27017/blog');


 var commentSchema = new mongoose.Schema({
	postnum : Number, 
	name : String,
	email : String,
	comment : String
 })

 var Comment = mongoose.model("Comment", commentSchema);

 app.get("/",function(req,res){
	res.render("default");
 });

 app.get("/blog", function(req,res){
	 return res.redirect('/blog/page/1/5');
 });

 app.get("/blog/page/:first/:last", function(req,res)
 {
	request("https://blog-8c770.firebaseio.com/post.json", function(error, response, body)
	{
		var posts = JSON.parse(body);
		var next = false;
		var first = parseInt(req.params.first);
		var last = parseInt(req.params.last);
		if(last > parseInt(posts["total"])) {
			last = parseInt(posts["total"]);
		}
		if(last < parseInt(posts["total"])){
			next = true; 
		}
		res.render("blog", {
			posts:posts, 
			first:first,
			last:last,
			next:next
		});
	});
 });
 app.get("/blog/post/:postnum/", function(req,res){
	var postid = parseInt(req.params.postnum); 
	var url = "https://blog-8c770.firebaseio.com/post/post"+ postid + ".json";
	request(url, function(error, response, body)
	{
		var post = JSON.parse(body);
		Comment.find({ postnum: postid}, function(err,comments){
			if(err){
				console.log("post id = " + postid); 
				console.log("error finding comments for post " + postid);
			}else{
				console.log(comments);
				res.render("post", {post:post, postnum : postid, comments : comments });
			}
		});
	});
});
app.post("/comment/:postnum", function(req,res){
	var postid = req.params.postnum; 
	Comment.create({ postnum : postid, 
					 name: req.body.name,
					 email: req.body.email,
					 comment: req.body.comment
	},function(err, newComment){
		if(err){
			console.log("error in creating new comment");
		}else{
			console.log(newComment); 
			console.log("post id is " + postid); 
			res.redirect("/blog/post/"+ postid); 
		}

	});
});

 app.get("/resume", function(req,res){
 	res.render("resume");
});


 app.listen(3000, process.env.VIP, function(){

	console.log("server listening..");
 });
