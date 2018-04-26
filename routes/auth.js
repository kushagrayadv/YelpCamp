var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


router.get("/", function(req,res){                                                  //homepage
   res.render("home"); 
});

router.get("/register", function(req, res){                                         //SignUp new route
   res.render("register"); 
});

router.post("/register", function(req, res){                                        //SignUp create route
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
       if(err){
           req.flash("error",err.message);
           console.log(err);
           return res.redirect("/register");
       }
       passport.authenticate("local")(req, res, function(){
           req.flash("success","Welcome to YelpCamp " + user.username);
           res.redirect("/campgrounds");
       });
   });
   
});

router.get("/login", function(req, res){                                            //Login new route
   res.render("login"); 
});

router.post("/login", passport.authenticate("local",                                //Login create route
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

router.get("/logout", function(req, res){                                           //Logout Route
   req.logout();
   req.flash("success", "Successfully Logged Out!");
   res.redirect("/campgrounds");
});

module.exports = router;