const Blog = require('../models/blog');

let middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
      return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
  }

  middlewareObj.checkBlogOwnership = (req, res, next) => {
    if(req.isAuthenticated()) {
      Comment.findById(req.params.blog_id, (err, foundBlog) => {
        if (err) {
          req.flash("error", "Blog not found");
          res.redirect("back");
        } else {
          if(foundBlog.author.id.equals(req.user._id)) {
            next();
          } else {
            req.flash("error", "You do not have permission to do that");
            res.redirect("back");
          }
        }
      });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
  }

  middlewareObj.checkBlogOwnership = (req, res, next) => {
      if(req.isAuthenticated()) {
        Blog.findById(req.params.id, (err, foundBlog) => {
          if (err) {
            res.redirect("/blogs");
          } else {
            if(foundBlog.author.id.equals(req.user._id)) {
              next();
            } else {
              req.flash("error", "Sorry, you are not the comment author");
              res.redirect("back");
            }
          }
        });
      } else {
          req.flash("error", "You need to be logged in to do that")
          res.redirect("back");
      }
    };

module.exports = middlewareObj;