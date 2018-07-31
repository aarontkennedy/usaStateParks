module.exports = function (app) {

    // Require all models
    const db = require("../../../models");
    const tableByAbbr = require("datasets-us-states-abbr-names");

    app.get("/api/park/v1/", function (req, res) {
        let state = req.query.state || null;
        const id = req.query.id || null;
        const longitude = req.query.lng || null;
        const latitude = req.query.lat || null;

        // get the max distance or set it to 10 kilometers
        let radiuskm = req.query.radiuskm || 10;

        if (state)
            searchByState(state, res);
        else if (id)
            searchByID(id, res);
        else if (longitude != null && latitude != null && radiuskm)
            searchByLocation(latitude, longitude, radiuskm, res);
        else
            return res.json(new Error('Missing query parameter like state or id.'));
    });

    /* https://stackoverflow.com/questions/36190373/mongoose-find-geo-points-by-radius */
    function searchByLocation(latitude, longitude, radiuskm, res) {
        // we need to convert the distance to radians
        // the radius of Earth is approximately 6371 kilometers
        const radians = radiuskm / 6371;

        // get coordinates [ <longitude> , <latitude> ] !!!
        var coords = [parseFloat(longitude), parseFloat(latitude)];

        db.StatePark.find({
            longitudeLatitude: {
                $near: coords,
                $maxDistance: radians
            }
        }).exec(function (err, locations) {
            if (err) {
                console.log("Error: "+err);
                return res.json(500, err);
            }

            //console.log(locations);
            res.json(locations);
        });
    }

    function searchByState(state, res) {
        if (state.length == 2) { // abbreviation
            if (state == "DC") {
                state = "District of Columbia";
            }
            else {
                // Get the state name:
                state = tableByAbbr[state.toUpperCase()];
            }

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
