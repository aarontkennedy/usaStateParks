module.exports = function (app) {

    // Require all models
    const db = require("../../../models");
    const tableByAbbr = require("datasets-us-states-abbr-names");

    app.get("/api/park/v1/", function (req, res) {
        let state = req.query.state;
        let id = req.query.id;

        if (state) searchByState(state, res);
        else if (id) searchByID(id, res);
        else {
            return res.json(new Error('Missing query parameter like state or id.'));
        }
    });

    function searchByState(state, res) {
        if (state.length == 2) { // abbreviation
            // Get the state name:
            state = tableByAbbr[state.toUpperCase()];

            // Ensure a valid abbreviation was provided...
            if (state === void 0) {
                console.log('Unrecognized state abbreviation. Value: `' + state + '`.');
                return res.json(new Error('Unrecognized state abbreviation. Value: `' + state + '`.'));
            }
        }

        //console.log(state);
        db.StatePark.find({ state: new RegExp(state, "i") })
            .then(function (results) {
                // If all Users are successfully found, send them back to the client
                res.json(results);
            })
            .catch(function (err) {
                // If an error occurs, send the error back to the client
                res.json(err);
            });
    }

    function searchByID(id, res) {

        //console.log(id);
        db.StatePark.find({ _id: id })
            .then(function (results) {
                // If all Users are successfully found, send them back to the client
                res.json(results);
            })
            .catch(function (err) {
                // If an error occurs, send the error back to the client
                res.json(err);
            });
    }
};
