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
	  User = require("./models/user"),
	  flash = require("connect-flash");
 app.set("view engine" ,"ejs");
 app.use('/public', express.static('public'));
 app.use('/css', express.static('css'));
 app.use('/vendor', express.static('vendor'));
 app.use('/images', express.static('public/images'));
 app.use('/common-js', express.static('common-js'));
 app.use(bodyParser.urlencoded({extended:false}));
 app.use(express.json());
 app.use(flash());
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

app.use(function(req,res,next){
	res.locals.login = req.flash("login");
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

 app.get("/",function(req,res){
	res.render("default", { currentUser: req.user});
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
			redirect("back");
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
			text: req.body.comment
		}, function(err, comment){
			if(err){
				console.log(err);
			} else {
				comment.author.id = req.user.id;
				comment.author.username = req.user.username;
				comment.save();
				post.comments.push(comment);
				post.save();
				req.flash("success", "코멘트 작성 완료!");
				res.redirect("/blog/post/"+ postid); 
			}
		});
});
});

 app.get("/resume", function(req,res){
 	res.render("resume");
});

app.get("/me", function(req,res){
	res.render("aboutme");
	const scroll = new SmoothScroll('a[href*="#"]',{
		speed:1000,
		updateURL:false,
		offset:100
	});

});

app.get("/post/:id/comment/:comment_id/edit", isLoggedIn, function(req,res){
	Comment.findById(req.params.comment_id, function(err,foundComment){
		if(err){
			req.flash("error", "자신의 코멘트만 수정 가능합니다!");
			res.redirect("back");
		}else{
			req.flash("success", "코멘트 수정 완료!");
			res.render("editComment", {id: req.params.id, comment: foundComment});
		}
	})
});

// COMMENT DESTORY 
app.post("/post/:id/comment/:comment_id/delete", checkCommentOwnership, function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			req.flash("error", "권한이 없습니다");
			res.redirect("/blog/post/"+req.params.id);
		}else{
			
			req.flash("success", "코멘트를 삭제했습니다");
			res.redirect("/blog/post/"+req.params.id);
		}
	});
});

app.post("/post/:id/comment/:comment_id/edit", checkCommentOwnership, function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id, { text: req.body.comment} , function(err,updatedComment){
		if(err){
			req.flash("error", "자신의 코멘트만 수정 가능합니다!");
			res.redirect("/blog/post/"+req.params.id);
		}else{

			req.flash("success", "코멘트 수정 완료!");
			res.redirect("/blog/post/"+req.params.id);
		}
	});
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
			req.flash("error", "이미 같은 이름을 가진 유저가 있습니다");
            res.redirect("/");
        }else {
        passport.authenticate("local")(req,res,function(){
			req.flash("success", "가입을 축하드립니다!");
            res.redirect("back");
		});
	}
    });
});


app.get("/login", function(req, res){
	res.render("login");
});
app.get("/loginFailure", function(req,res){
	req.flash("error", "로그인에 실패했습니다");
	res.redirect("/login");
});
app.post("/login", passport.authenticate("local", 
   {
	   successRedirect : "/", 
	   failureRedirect : "/loginFailure"
	}), function(req,res){
	req.body.username 
    req.body.password
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
			req.flash("error", "로그인에 실패했습니다");
            res.redirect("back");
        }
        passport.authenticate("local")(req,res,function(){
			req.flash("success", "로그인을 했습니다");
            res.redirect("/");
        });
    });
});

app.get("/logout", function(req,res){
	req.logout();
	req.flash("success", "성공적이게 로그아웃 했습니다");
    res.redirect("back");
});

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
})
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "로그인을 해야합니다.");
	res.redirect("back");
}

function checkCommentOwnership (req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back");
			}else{
				if(foundComment.author.id.equals(req.user.id)){
					next();
				}else{
					req.flash("error", "자신의 코멘트만 수정 가능합니다.");
					res.redirect("back");
				}
			}
		})
	}else{
		req.flash("error","로그인이 필요합니다");
		res.redirect("back");
	}
}

 app.listen(3000, process.env.VIP, function(){

	console.log("server listening..");
 });

 