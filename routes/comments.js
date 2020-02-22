var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.render("login");
}
//========================
// COMMENTS ROUTE
//========================
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
	//Find campground by id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {campground: campground});
		}
	})
});

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
	//Lookup campground using ID
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			req.flash("error", "Something went wrong !");
			res.redirect("/campgrounds");
		}else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				}else{
					//Add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//Save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					console.log(comment);
					req.flash("success", "Successfully added comment !");
					res.redirect("/campgrounds/" + campground._id);
				}
			})
		}
	});
	//Create new comment
	//Connect new comment to campground
	//Redirect page
});

//COMMENT EDIT ROUTE
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){

	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else{
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
});

//COMMENT UPDATE
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
	
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
			console.log(err);
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DELETE COMMENT ROUTE
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success", "Comment successfully deleted !");
			res.redirect("/campgrounds/" + req.params.id);
		}	
	});
});






module.exports = router;