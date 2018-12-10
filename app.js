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
 
 var app = express(),
	  passport = require("passport"),
	  LocalStrategy = require("passport-local"),
	  User = require("./models/user");
 app.set("view engine" ,"ejs");
 app.use('/public', express.static('public'));
 app.use('/css', express.static('css'));
 app.use('/vendor', express.static('vendor'));
 app.use('/images', express.static('public/images'));
 app.use('/common-js', express.static('common-js'));
 app.use(bodyParser.urlencoded({extended:false}));
 app.use(express.json());

 // PASSPORT CONFIGURATION
 app.use(require("express-session")({
	secret : "this blog is made by se jin lee",
	resave : false,
	saveUninitialized: false
})); 

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


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
app.post("/comment/:id", isLoggedIn, function(req,res){
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


// AUTH

app.get("/register", function(req, res){
	res.render("register");
});

app.post("/register", function(req,res){
	req.body.username 
    req.body.password
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.redirect("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/blog");
        });
    });
});


app.get("/login", function(req, res){
	res.render("login");
});

app.post("/login", passport.authenticate("local", 
   {
	   successRedirect : "/", 
	   failureRedirect : "/login"
	}), function(req,res){
	req.body.username 
    req.body.password
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.redirect("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/blog");
        });
    });
});

app.get("/logout", function(req,res){
	req.logout();
    res.redirect("/");
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}


 app.listen(3000, process.env.VIP, function(){

	console.log("server listening..");
 });
