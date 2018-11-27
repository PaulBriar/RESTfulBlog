const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = 3000;

//App Config
mongoose.connect("mongodb://localhost/RESTfulBlog", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

//Mongoose/Model Config
let blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now},
});
let Blog = mongoose.model("Blog", blogSchema);

//RESTful Routes
app.get("/", (req, res) => res.redirect("/blogs"));
//Index Route
app.get("/blogs", (req, res) => {
  Blog.find({}, (err, blogs) => {
    if(err) {
      console.log(err);
    } else {
      res.render("index", {blogs: blogs});
    }
  });
});
//New Route
app.get("/blogs/new", (req, res) => res.render("new"));
//Create Route
app.post("/blogs", (req, res) => {
  Blog.create(req.body.blog, (err, newBlog) => {
    if(err) {
      res.render("new");
    } else {
      res.redirect("/blogs");
    }
  });
});
//Show Route
app.get("/blogs/:id", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if(err) {
      res.redirect("/blogs");
    } else {
      res.render("show", {blog: foundBlog});
    }
  });
});
//Edit Route
app.get("/blogs/:id/edit", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if(err) {
      res.redirect("/blogs");
    } else {
      res.render("edit", {blog: foundBlog});
    }
  });
});
//Update Route
app.put("/blogs/:id", (req, res) => {
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});
//Destroy Route
app.delete("/blogs/:id", (req, res) => {
  Blog.findByIdAndRemove(req.params.id, (err) => {
    if(err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});
app.listen(3000, () => console.log(`Listening on port ${port}`));
