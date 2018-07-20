module.exports = function (app) {

    const db = require("../../../models/index.js");

    app.get("/", function (req, res) {
        res.render("index");
    });

};
