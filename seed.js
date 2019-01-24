var mongoose = require("mongoose");
var moment = require("moment");
var Post = require("./models/post");
var Comment   = require("./models/comment");
var date1 = new Date(2018,9,24),
    date2 = new Date(2018,10,29);
    date3 = new Date(2019,0,23);
var data = [
    {
        title: "백엔드 인턴은 무엇을 할까?",
        image: "internships.jpg",
        description :  "2018년 회사에서 하고, 배운 것",
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