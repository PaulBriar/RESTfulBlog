const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = 3000;

//App Config
mongoose.connect("mongodb://localhost/RESTfulBlog", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

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

app.get("/blogs", (req, res) => {
  Blog.find({}, (err, blogs) => {
    if(err) {
      console.log(err);
    } else {
      res.render("index", {blogs: blogs});
    }
  });
});

app.listen(3000, () => console.log(`Listening on port ${port}`));
