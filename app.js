 var express = require("express");
 var request = require("request");
 var app = express();
 app.set("view engine" ,"ejs");
 app.use('/public', express.static('public'));
 app.use('/css', express.static('css'));
 app.use('/vendor', express.static('vendor'));
 app.use('/images', express.static('/images'));
 app.get("/",function(req,res){
	res.render("default");
 });

 app.get("/blog", function(req,res){
	 return res.redirect('/blog/page/0/5');
 });

 app.get("/blog/page/:first/:last", function(req,res)
 {
	request("https://blog-8c770.firebaseio.com/post.json", function(error, response, body)
	{
		var posts = JSON.parse(body);
		console.log(posts);

		var first = parseInt(req.param.first);
		var last = parseInt(req.params.last);
		if(last > posts["total"]) {
			last = parseInt(posts["total"]);
		}
		console.log("first : " + first);
		console.log("last : " + last);
		
		res.render("blog", {
			posts:posts, 
			first:first,
			last:last
		});
	});
 });
 app.get("/blog/:post", function(req,res){
	var post = req.params.post;
	res.render("post" + post, {post:post});
});

 app.get("/resume", function(req,res){
 	res.render("resume");
});
 app.listen(3000, process.env.VIP, function(){

	console.log("server listening..");
 });
