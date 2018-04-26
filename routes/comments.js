var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req,res){                      //Comments CREATE route
    Campground.findById(req.params.id, function(err, campground){
       if(err){
           
           console.log(err);
       } else {
           res.render("comments/new", {campground: campground});
       }
    });
});

router.post("/", middleware.isLoggedIn, function(req,res){                         //Commets SHOW route
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
       } else {
            Comment.create(req.body.comment, function(err, comment){
               if(err){
                   req.flash("error", "Something went wrong");
                   console.log(err);
                   res.redirect("/campgrounds");
               } else {
                  //assocaiting the user and comment model
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  comment.save();
                  //pushing the comment in the campground model
                  campground.comments.push(comment);
                  campground.save();
                  req.flash("success","Comment added")
                  res.redirect("/campgrounds/" + campground._id);
               }
                
            });
       }
   });
});

router.get("/:comment_id/edit",middleware.checkCommentOwner, function(req, res){                     //Comments EDIT Route
   Comment.findById(req.params.comment_id, function(err, foundComment){
       if(err){
           res.redirect("back");
       } else {
           res.render("comments/edit", {comment: foundComment, campground_id: req.params.id});
       }
   }); 
});

router.put("/:comment_id",middleware.checkCommentOwner, function(req, res){            //Comments UPDATE route
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

router.delete("/:comment_id",middleware.checkCommentOwner, function(req, res){         //Comments DESTROY Route
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success","Comment deleted");
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});


module.exports = router;