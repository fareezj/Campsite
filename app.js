var express 		= require("express"),
	bodyParser 		= require("body-parser"),
	mongoose 		= require("mongoose"),
	passport	  	= require("passport"),
	LocalStrategy 	= require("passport-local"),
	Campground  	= require("./models/campground"),
	User			= require("./models/user"),
	Comment   		= require("./models/comment"),
	seedDB			= require("./seeds"),
	methodOverride	= require("method-override"),
	commentRoutes 	= require("./routes/comments"),
	campgroundRoutes= require("./routes/campgrounds"),
	indexRoutes		= require("./routes/index"),
	flash			= require("connect-flash"),
	app = express();

console.log(process.env.DATABASEURL);
	
//seedDB();
mongoose.connect(process.env.DATABASEURL);
//mongoose.connect("mongodb+srv://Fareez:123@yelpcamp-meupg.mongodb.net/test?retryWrites=true&w=majority");

//mongodb+srv://Fareez:123@yelpcamp-meupg.mongodb.net/test?retryWrites=true&w=majority
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Hello Yelp Camp",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});


app.get("/", function(req, res){
	res.render("landing");
});


// app.get("/campgrounds", function(req, res){

// 	Campground.find({}, function(err, allCampGrounds){
// 		if(err){
// 			console.log(err)
// 		}else{
// 			res.render("campgrounds/index", {campgrounds: allCampGrounds, currentUser: req.user});
// 		}
// 	});
	
// });

// app.post("/campgrounds", function(req, res){
	
// 	var name = req.body.name;
// 	var image = req.body.image;
// 	var desc = req.body.description;
// 	var newCampGround = {name:name, image:image, description:desc}
	
// 	//Create new campground and save to database
// 	Campground.create(newCampGround, function(err, newlyCampGround){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			console.log(newCampGround);
// 			res.redirect("/campgrounds");
// 		}
// 	});
// });

// app.get("/campgrounds/new", function(req, res){
// 	res.render("campgrounds/new");
// });

// //SHOW ROUTE
// app.get("/campgrounds/:id", function(req, res){
// 	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			console.log(foundCampground);
// 			res.render("campgrounds/show", {campground: foundCampground});
// 		}
// 	});
// });

// //========================
// // COMMENTS ROUTE
// //========================
// app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
// 	//Find campground by id
// 	Campground.findById(req.params.id, function(err, campground){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			res.render("comments/new", {campground: campground});
// 		}
// 	})
// });

// app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
// 	//Lookup campground using ID
// 	Campground.findById(req.params.id, function(err, campground){
// 		if(err){
// 			console.log(err);
// 			res.redirect("/campgrounds");
// 		}else{
// 			Comment.create(req.body.comment, function(err, comment){
// 				if(err){
// 					console.log(err);
// 				}else{
// 					campground.comments.push(comment);
// 					campground.save();
// 					console.log(comment);
// 					res.redirect("/campgrounds/" + campground._id);
// 				}
// 			})
// 		}
// 	});
// 	//Create new comment
// 	//Connect new comment to campground
// 	//Redirect page
// });


// //========================
// // AUTHS ROUTE
// //========================

// //Show register form
// app.get("/register", function(req, res){
// 	res.render("register");
// });

// //Handle register
// app.post("/register", function(req, res){
// 	var newUser = new User({username: req.body.username});
// 	User.register(newUser, req.body.password, function(err, user){
// 		if(err){
// 			console.log(err);
// 			return res.render("login");
// 		}
// 		passport.authenticate("local")(req, res, function(){
// 			res.redirect("/campgrounds");
// 		});
// 	});
// });

// //Login Form
// app.get("/login", function(req, res){
// 	res.render("login");
// })

// //Handling Login
// app.post("/login", passport.authenticate("local", 
// 	{
// 		successRedirect:"/campgrounds",
// 		failureRedirect:"/login"
	
// 	}), function(req, res){
		
// 	});

// //LOGOUT ROUTE
// app.get("/logout", function(req, res){
// 	req.logout();
// 	res.redirect("/campgrounds");
// });

// function isLoggedIn(req, res, next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.render("login");
// }

app.use(commentRoutes);
app.use(campgroundRoutes);
app.use(indexRoutes);


app.listen(process.env.PORT || 3000, function(){
	console.log("Yelp Camp has started...")
});