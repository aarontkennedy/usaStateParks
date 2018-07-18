module.exports = function (app) {

    const db = require("../../../models/index.js");

    app.get("/", function (req, res) {
        res.render("index");
    });

    app.get("/diary/:user", function (req, res) {
        db.Users.findOne({
            where: {
                googleID: {
                    [db.sequelize.Op.eq]: req.params.user
                }
            },
        }).then(function (result) {
            console.log(result.dataValues);
            res.render("app", {
                user: result.dataValues,
                signedIn: true
            });
        })
            .catch(error => res.status(400).send(error));
    });
};
