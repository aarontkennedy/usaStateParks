// Dependencies
// =========================================================
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
var mongoose = require("mongoose");

// Require all models
var db = require("./models");
// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/usaStateParks");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Sets up the Express App
// =========================================================
let app = express();
const PORT = process.env.PORT || 3000;

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({
  layoutsDir: "app/public/views/layouts",
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");
app.set('views', 'app/public/views');

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// express will handle the static files
app.use(express.static('app/public'));

require('./app/controller/routing/htmlRoutes.js')(app);
require('./app/controller/routing/scrapeRoutes.js')(app);
require('./app/controller/routing/apiRoutes.js')(app);

app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
