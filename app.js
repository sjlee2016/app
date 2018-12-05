 var express = require("express");
 var request = require("request");
 var app = express();
 app.set("view engine" ,"ejs");
 app.use('/public', express.static('public'));
 app.use('/css', express.static('css'));
 app.use('/vendor', express.static('vendor'));
 app.use('/images', express.static('public/images'));
 app.use('/common-js', express.static('common-js'));
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
	console.log(parseInt(req.params.postnum));
	var url = "https://blog-8c770.firebaseio.com/post/post"+parseInt(req.params.postnum) + ".json";
	console.log(url);
	request(url, function(error, response, body)
	{
		console.log(body);
		var post = JSON.parse(body);
		console.log(post);
		res.render("post", {post:post});
	});
});

 app.get("/resume", function(req,res){
 	res.render("resume");
});
 app.listen(3000, process.env.VIP, function(){

	console.log("server listening..");
 });
