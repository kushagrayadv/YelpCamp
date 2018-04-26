var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get("/", function(req, res){                                                 //INDEXRoute
   Campground.find({}, function(err, allCampgrounds){
      if(err){
          console.log(err);
      } else {
          res.render("campgrounds/index", {camp: allCampgrounds});
      }
   });
});


router.get("/new", middleware.isLoggedIn, function(req, res){                                  //NEW Route
    res.render("campgrounds/new");
});


router.post("/", middleware.isLoggedIn, function(req, res){                                    //CREATE Route
   var campName = req.body.campName;
   var image = req.body.image;
   var price = req.body.price;
   var description = req.body.description;
   var author = {
       id: req.user._id,
       username: req.user.username
   };
   var newCampground = {
            name:campName,
            image: image,
            price: price,
            description: description, 
            author: author
   };
  console.log(req.body)
  
   Campground.create(newCampground, function(err, newlycreated){
      if(err){
         console.log(err);
      } else {
         res.redirect("/campgrounds");
      }
   });
});


router.get("/:id", function(req, res) {                                                         //SHOW route
    Campground.findById(req.params.id).populate("comments").exec( function(err, foundcampground){
       if(err){
         req.flash("error", "Campmground not found");
          console.log(err);
       } else {
          res.render("campgrounds/show", {campground: foundcampground});
       }
    });
});

router.get("/:id/edit", middleware.checkCampOwner, function(req, res) {                        // EDIT route
   Campground.findById(req.params.id, function(err, foundCampground){
      if(err){
         console.log(err);
      } else {
         res.render("campgrounds/edit", {campground: foundCampground});
      }
   });
});

router.put("/:id", middleware.checkCampOwner, function(req, res){                                              //UPDATE Route
   Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, updatedCampground){
      if(err){
         res.redirect("/campgrounds");
      } else {
         res.redirect("/campgrounds/" + req.params.id);
      }
   });
});

router.delete("/:id", middleware.checkCampOwner, function(req, res){                                           //DELETE route
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
         res.redirect("/campgrounds");
      } else {
         res.redirect("/campgrounds");
      }
   });
});


module.exports = router;