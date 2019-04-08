var mongoose = require("mongoose");
var moment = require("moment");
var Post = require("./models/post");
var Comment   = require("./models/comment");
var date1 = new Date(2018,9,24),
    date2 = new Date(2018,10,29);
    date3 = new Date(2019,3,7);
var data = [
    {
        title: "실리콘벨리 인턴이라고 다 행복할까?",
        image: "wage.jpg",
        description :  "7개월동안 겪은 불편한 점들",
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