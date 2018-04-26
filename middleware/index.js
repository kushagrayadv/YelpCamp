var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareobj = {};

middlewareobj.isLoggedIn = function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }  
           req.flash("error", "Please Login/SignUp first!!");
            res.redirect("/login");
        };
                         
middlewareobj.checkCampOwner = function(req, res, next){
       if(req.isAuthenticated()){
      Campground.findById(req.params.id, function(err, foundCampground) {
          if(err){
              req.flash("error", "Campmground not found");
             res.redirect("back");
          } else {
            if(foundCampground.author.id.equals(req.user._id)){
               next();
            } else {
               req.flash("error", "Access Denied");
               res.redirect("/campgrounds/" + foundCampground._id);
            }
          }
      });
   } else {
      res.redirect("back");
   }
};

middlewareobj.checkCommentOwner = function(req, res, next){
    if(req.isAuthenticated()){
         Comment.findById(req.params.id, function(err, foundComment) {
             if(err){
                 res.redirect("back");
             } else {
             if(foundComment.author.id.equals(req.user._id)){
                   next();
             } else {
                   res.redirect("back");
             }
            }
        });
    } else {
          res.redirect("back");
    }
};

module.exports = middlewareobj;