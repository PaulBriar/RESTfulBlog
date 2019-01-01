const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const middleware = require('../middleware');

//RESTful Routes
router.get("/", (req, res) => res.redirect("/blog"));
//Index Route
router.get("/blog", (req, res) => {
  Blog.find({}, (err, blogs) => {
    if(err) {
      console.log(err);
    } else {
      res.render("index", {blogs: blogs});
    }
  });
});
//New Route
router.get("/blogs/new", middleware.isLoggedIn, (req, res) => res.render("new"));
//Create Route
router.post("/blogs", middleware.isLoggedIn, (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, (err, newBlog) => {
    if(err) {
      res.render("new");
    } else {
      res.redirect("/blogs");
    }
  });
});
//Show Route
router.get("/blogs/:id", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if(err) {
      res.redirect("/blogs");
    } else {
      res.render("show", {blog: foundBlog});
    }
  });
});
//Edit Route
router.get("/blogs/:id/edit", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if(err) {
      res.redirect("/blogs");
    } else {
      res.render("edit", {blog: foundBlog});
    }
  });
});
//Update Route
router.put("/blogs/:id", middleware.checkBlogOwnership, (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});
//Destroy Route
router.delete("/blogs/:id", middleware.checkBlogOwnership, (req, res) => {
  Blog.findByIdAndRemove(req.params.id, (err) => {
    if(err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});

module.exports = router;