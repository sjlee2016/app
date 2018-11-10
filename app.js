 var express = require("express");
 var request = require("request");
 var app = express();
 app.set("view engine" ,"ejs");
 
 app.get("/",function(req,res){
	res.render("default");
 });

 app.get("/blog", function(req,res){
	res.render("blog");
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
