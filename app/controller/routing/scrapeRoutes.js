module.exports = function (app) {

    // Our scraping tools
    // Axios is a promised-based http library, similar to jQuery's Ajax method
    // It works on the client and on the server
    const axios = require("axios");
    const cheerio = require("cheerio");

    const googleAPIkey = require("./googleAPIkey.json");

    const googleMapsClient = require('@google/maps').createClient({
        key: (process.env.googleAPIkey || googleAPIkey.key)
    });

    // Require all models
    const db = require("../../../models");

    /*
    -- Dangerous
    app.get("/admin/drop", function (req, res) {
        db.StatePark.remove({}, (err) => { if (err) console.log(err); });
        res.send("Drop Complete");
    });*/

    // this function scrapes the state index page on wikipedia to get the 
    // link to the actual page of a state's state parks
    app.get("/admin/scrape", function (req, res) {

        // would it be easier to just dump/drop the whole state
        // park database and repopulate since I have to rescrape 
        // everything anyways to find changes?

        // Yes, Andrey, I know you want to save the files in the database
        // and check if they have changed, but that takes time and $.
        // I need a secretary.
        db.StatePark.remove({}, (err) => { if (err) console.log(err); });

        // First, we grab the body of the html with request
        const wikipedia = "https://en.wikipedia.org";
        const wikiStateParksIndexPage = wikipedia + "/wiki/Lists_of_state_parks_by_U.S._state";
        axios.get(wikiStateParksIndexPage).then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            const $ = cheerio.load(response.data);

            // Now, we grab the #mw-content-text ul tag, and do the following:
            const element = $("#mw-content-text ul")[0];

            $(element).find("a").each(function () {
                getStatesParks(
                    clean($(this).text()),
                    wikipedia + $(this).attr("href")
                );
            });

            res.send("Scraping...");
        });
    });

    function getStatesParks(state, url) {
        if (state == "Alaska" || state == "Hawaii") {
            return getStateParksFromLists(state, url);
        }
        return getStatesParksFromTable(state, url);
    }

    function getStatesParksFromTable(state, url) {

        // First, we grab the body of the html with request
        axios.get(url).then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            const $ = cheerio.load(response.data);

            // Now, we grab the #mw-content-text .wikitable tag, and do the following:
            const table = Array.from($(".wikitable"))[0];
            const rows = Array.from($(table).find("tr"));
            let parkNameCol = 0;
            let parkLocationCol = null; // country/parish/island...
            let parkImageCol = null;
            let parkRemarksCol = null;

            // first row is the header info, figure out the columns
            $(rows[0]).children().each(function (i, element) {
                const colText = $(this).text().trim();
                //console.log(colText);

                if (state == "Kentucky") {
                    parkNameCol = 1;
                }
                else if ((colText.includes("County") ||
                    colText.includes("Location") ||
                    colText.includes("Region") ||
                    colText.includes("Parish")) &&
                    !parkLocationCol) {
                    parkLocationCol = i;
                }
                else if (colText.includes("Image")) {
                    parkImageCol = i;
                }
                else if (colText.includes("Remarks") ||
                    colText.includes("Description")) {
                    parkRemarksCol = i;
                }
            });

            let arrayOfNewStateParks = [];
            // now grab the actual rows of data
            for (let i = 1; i < rows.length; i++) { // skip 0/the header

                const columns = Array.from($(rows[i]).children());

                const parkName = clean($(columns[parkNameCol]).text());

                // sometimes there is a second row that holds acreage -not a park
                if (parkName.toLowerCase() != "acres") {
                    arrayOfNewStateParks.push(new db.StatePark({
                        name: parkName,
                        location: clean($(columns[parkLocationCol]).text()),
                        state: state,
                        country: "USA",
                        imageURL: (parkImageCol ? cleanURL($(columns[parkImageCol]).text()) : null),
                        remarks: (parkRemarksCol ? clean($(columns[parkRemarksCol]).text()) : null)
                    }));
                }
            }

            db.StatePark.insertMany(arrayOfNewStateParks);
        });
    }

    function clean(string) {
        // ran into a problem with unicode space 160...
        return string.trim().replace(/\[.*\]/g, "").replace(/\s/g /* all kinds of spaces*/,
            " " /* ordinary space */);
    }

    function cleanURL(string) {
        const url = clean(string);
        const patt = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/);
        if (patt.test(url)) return url;
        return null;
    }

    function getStateParksFromLists(state, url) {
        //console.log(state);
        // First, we grab the body of the html with request
        axios.get(url).then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            const $ = cheerio.load(response.data);

            let arrayOfNewStateParks = [];

            $("ul").each(function (i, element) {

                $(this).children().each(function (i, element) {
                    const name = clean($(this).text());

                    if ((name.includes("State") ||
                        name.includes("Park")) &&
                        !name.includes("\n") &&
                        name != ("State symbols") &&
                        name != ("State parks of Hawaii") &&
                        name != ("Lists of state parks of the United States") &&
                        name != ("State parks of Alaska") &&
                        !name.startsWith("Alaska Department of Natural Resources")) {
                        arrayOfNewStateParks.push(new db.StatePark({
                            name: name,
                            state: state,
                            country: "USA"
                        }));
                    }
                });
            });

            db.StatePark.insertMany(arrayOfNewStateParks);
        });
    }

    app.get("/admin/count", function (req, res) {

        db.StatePark.count({}, function (err, c) {
            console.log('Count is ' + c);
            res.send(`Total: ${c}`);
        });
    });

    app.get("/admin/countLatLngNeedPopulating", function (req, res) {

        db.StatePark.find({longitudeLatitude: null}).then(function (results) {
            res.send(`Total without Lat/Lng: ${results.length}`);
        });
    });

    app.get("/admin/populateLatLng", function (req, res) {
        // db.inventory.find( { item: null } )
        db.StatePark.find({longitudeLatitude: null}).then(function (results) {
            recursivelyGeocodeArrayElements(results);

            res.send("Populating Lat/Lng... "+results.length+" to do...");
        });

    });

    function recursivelyGeocodeArrayElements(array) {
        console.log("recursivelyGeocodeArrayElements... "+array.length+" to do...");
        if (array.length < 1) return; // done!

        const park = array.pop();
        // Geocode an address.
        googleMapsClient.geocode({
            address: `${park.name}, ${park.state}, ${park.country}`
        }, function (err, response) {
            if (!err) {
                console.log(response.json.results);
                console.log(response.json.results[0].geometry.location);
                db.StatePark.updateOne({ _id: park._id },
                    { longitudeLatitude: [response.json.results[0].geometry.location.lng, response.json.results[0].geometry.location.lat] }).exec();

                setTimeout(() => {recursivelyGeocodeArrayElements(array)}, 200);
            }
            else {
                console.log("Geocode Error: " + err + ". Giving up...");
            }
        });
    }
}
