var mongoose = require("mongoose");
var moment = require("moment");
var Post = require("./models/post");
var Comment   = require("./models/comment");
var date1 = new Date(2018,9,24),
    date2 = new Date(2018,10,29);
var data = [
    {
        title: "실리콘벨리 인턴십 합격후기",
        image: "siliconValley.png",
        description : "컴퓨터공학을 전공하는 대학생이라면 모두가 꿈꾸는 실리콘벨리",
        author : "Se Jin Lee",
        posted : date1,
        formated_date : moment(date1).format('YYYY-MM-DD') 
    },
    {
        title: "한 달의 인턴생활 그리고 느낀 것",
        image: "morning.jpg",
        description :  "요즘 저는 이렇게 지냈어요",
        author : "Se Jin Lee",
        posted : date2,
        formated_date : moment(date2).format('YYYY-MM-DD') 
    
    }
]
 

function seedDB(){
   //Remove all campgrounds
   Post.remove({}, function(err){
        if(err){
            console.log(err);
        }
         console.log("removed posts!");
         Comment.remove({}, function(err) {
             if(err){
                 console.log(err);
             }
             console.log("removed comments!");
              //add a few posts
             data.forEach(function(seed){
                 Post.create(seed, function(err, campground){
                     if(err){
                         console.log(err)
                     } else {
                        console.log("added a post");
                     }
                    });
                }
            );
        });
    });
}
                         //create a comment
        //                 Comment.create(
        //                     {
        //                         posted: new Date(),
        //                         formated_date: moment(new Date()).format('YYYY-MM-DD') ,
        //                         text: "this is great",
        //                         User: "Homer",
        //                         email: "example"
        //                     }, function(err, comment){
        //                         if(err){
        //                             console.log(err);
        //                         } else {
        //                             campground.comments.push(comment);
        //                             campground.save();
        //                             console.log("Created new comment");
        //                         }
        //                     });
        //             }
        //         });
        //     });
        // });
     
    //add a few comments

 
module.exports = seedDB;