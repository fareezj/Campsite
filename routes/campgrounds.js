var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


router.get("/campgrounds", function(req, res){

	Campground.find({}, function(err, allCampGrounds){
		if(err){
			console.log(err)
		}else{
			res.render("campgrounds/index", {campgrounds: allCampGrounds});
		}
	});
	
});

router.post("/campgrounds", middleware.isLoggedIn,  function(req, res){
	
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user.id,
		username: req.user.username
	}
	var newCampGround = {name:name, price:price, image:image, description:desc, author: author}
	
	//Create new campground and save to database
	Campground.create(newCampGround, function(err, newlyCampGround){
		if(err){
			console.log(err);
		}else{
			console.log(newlyCampGround);
			res.redirect("/campgrounds");
		}
	});
});

router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//SHOW ROUTE
router.get("/campgrounds/:id", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			console.log(foundCampground);
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

//EDIT CAMPGROUND
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership,  function(req, res){
	
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});		
	});
});
//UPDATE CAMPGROUND
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DELETE CAMPGROUND
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
});



module.exports = router;
