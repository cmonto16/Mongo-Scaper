var express = require("express");
var mongoose = require("mongoose");
var models = require("./models");
var cheerio = require("cheerio");
var axios = require("axios");

var PORT = process.env.PORT || 3000;

var app = express();

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.delete("/articles/:id", function(req, res) {
  var id = req.params.id;
  models.Article.findByIdAndRemove(id).then(() => res.status(200).json({result:"success"}));
});

app.post("/articles", function(req, res) {
  const newArticle = new models.Article(req.body);
  newArticle.save().then(() => res.status(200).json({result:"success"}));
});

app.get("/scrape", function(req, res) {
  axios.get("http://digg.com/").then(function(response) {
    var $ = cheerio.load(response.data);

    var results = [];

    $("div.digg-story__container").each(function(i, element) {
      var cheerioElement = $(element);
      var a = cheerioElement.find("a.digg-story__title-link");
      var link = a.attr("data-href");
      // some stories don't have a link, so skip them
      if (!link) {
        return;
      }
      var title = (a.contents()[0].data || "").trim();
      var descElement = cheerioElement.find("div.digg-story__description");
      var description = (descElement.contents()[0].data || "").trim();

      results.push({
        title: title,
        link: link,
        description: description
      });
    });
    res.render("scrape", {articles:results});
  });
});

app.get("/saved", async function(req, res) {
  const articles = await models.Article.find().select('title description link').populate('notes');
  res.render("saved", {articles:articles});
});

app.get("/", function(req, res) {
  res.render("index");
});

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
  console.log("Server listening on: http://localhost:" + PORT);
});
