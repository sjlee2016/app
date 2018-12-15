var mongoose = require("mongoose");
var moment = require("moment");
var Post = require("./models/post");
var Comment   = require("./models/comment");
var date1 = new Date(2018,9,24),
    date2 = new Date(2018,10,29);
    date3 = new Date(2018,11,14);
var data = [
    {
        title: "교환학생 vs 퍼듀 캡스톤 프로그램 vs 인턴십",
        image: "california.jpg",
        description :  "내가 개인적으로 느낀 각 프로그램의 장단점",
        author : "Se Jin Lee",
        posted : date3,
        formated_date : moment(date3).format('YYYY-MM-DD') 
    
    }
]
 

function seedDB(){
   //Remove all campgrounds
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