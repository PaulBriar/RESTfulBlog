const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');
const mongoose = require('mongoose');
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('connect-flash');

const app = express();
const port = 3000;

const Blog = require('./models/blog');
const User = require('./models/user');
const middleware = require('./middleware/index');

//Requiring routes
let indexRoutes = require('./routes/index'),
    blogRoutes = require('./routes/blogs');
app.use(indexRoutes);
app.use('/blogs', blogRoutes);

//App Config
mongoose.connect("mongodb://localhost/RESTfulBlog", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(flash());

//Passport Config
app.use(require("express-session")({
  secret: "Rusty is the cutest dog",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use( (req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});


app.listen(3000, () => console.log(`Listening on port ${port}`));
