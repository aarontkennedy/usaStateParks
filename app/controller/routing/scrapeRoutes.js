module.exports = function (app) {

    app.get("/scrape", function (req, res) {
        res.render("index");
    });

};
