module.exports = function (app) {

    // Require all models
    const db = require("../../../models");
    const tableByAbbr = require("datasets-us-states-abbr-names");
    const tableByName = require('datasets-us-states-names-abbr');

    app.get("/api/park/v1/", function (req, res) {
        let state = req.query.state;

        if (state.length == 2) { // abbreviation
            // Get the state name:
            state = tableByAbbr[state.toUpperCase()];

            // Ensure a valid abbreviation was provided...
            if (state === void 0) {
                console.log('Unrecognized state abbreviation. Value: `' + state + '`.');
                return res.json(new Error('Unrecognized state abbreviation. Value: `' + state + '`.'));
            }
        }
        else {
            // valid state?
            // Get the state abbreviation:
            state = state.toLowerCase();
            state = state.charAt(0).toUpperCase() + state.slice(1);
            const abbr = tableByName[state];

            // Ensure a valid state name was provided...
            if (abbr === void 0) {
                console.log('Unrecognized state. Value: `' + abbr + '`.');
                return res.json(new Error('Unrecognized state. Value: `' + abbr + '`.'));
            }
        }

        console.log(state);
        db.StatePark.find({ state: state })
            .then(function (results) {
                // If all Users are successfully found, send them back to the client
                res.json(results);
            })
            .catch(function (err) {
                // If an error occurs, send the error back to the client
                res.json(err);
            });
    });
};
