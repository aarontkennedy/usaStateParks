module.exports = function (app) {

    // Our scraping tools
    // Axios is a promised-based http library, similar to jQuery's Ajax method
    // It works on the client and on the server
    const axios = require("axios");
    const cheerio = require("cheerio");

    // this function scrapes the state index page on wikipedia to get the 
    // link to the actual page of a state's state parks
    app.get("/scrape", function (req, res) {
        // First, we grab the body of the html with request
        const wikipedia = "https://en.wikipedia.org";
        const wikiStateParksIndexPage = wikipedia + "/wiki/Lists_of_state_parks_by_U.S._state";
        axios.get(wikiStateParksIndexPage).then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            const $ = cheerio.load(response.data);

            // Now, we grab the #mw-content-text ul tag, and do the following:
            const element = $("#mw-content-text ul")[0];

            $(element).find("a").each(function () {
                // make this a promise
                getStatesParks(
                    $(this).text(),
                    wikipedia + $(this).attr("href")
                );
            });

            // If we were able to successfully scrape and save an Article, send a message to the client
            res.send("Scrape Complete");
        });
    });

    var temp = 0;

    function getStatesParks(state, url) {
        // Alaska and Hawaii are stupid and don't put theirs in tables...
        // ignore them for now
        if (state == "Alaska" || state == "Hawaii") return; 

        // First, we grab the body of the html with request
        axios.get(url).then(function (response) {
            console.log(state + " " + url);
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            const $ = cheerio.load(response.data);

            // Now, we grab the #mw-content-text .wikitable tag, and do the following:
            const table = $("#mw-content-text .wikitable");
            const rows = Array.from(table.find("tr"));
            let parkNameCol = null;
            let parkCountyCol = null;
            let parkYearCol = null;
            let parkImageCol = null;
            let parkRemarksCol = null;

            // first row is the header info, figure out the columns
            $(rows[0]).children().each(function (i, element) {
                const colText = $(this).text().trim();
                console.log(colText);

                if (colText.includes("Park") || colText.includes("Name")) {
                    parkNameCol = i;
                }
                else if ((colText.includes("County") ||
                    colText.includes("Location") ||
                    colText.includes("Region") ||
                    colText.includes("Parish")) &&
                    !parkCountyCol) {
                    parkCountyCol = i;
                }
                else if ((colText.includes("Year") ||
                    colText.includes("Date") ||
                    colText.includes("Estab")) && !parkYearCol) {
                    parkYearCol = i;
                }
                else if (colText.includes("Image")) {
                    parkImageCol = i;
                }
                else if (colText.includes("Remarks") ||
                    colText.includes("Description")) {
                    parkRemarksCol = i;
                }

            });

            // do we have valid columns for the following pieces of info
            // we can't check others, not every table is the same...
            if (parkNameCol === null) {
                throw new Error("parkNameCol is null");
            }
            if (!parkCountyCol) {
                throw new Error("parkCountyCol is null");
            }



            // Save an empty result object
            /*var result = {};
      
            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
              .children("a")
              .text();
            result.link = $(this)
              .children("a")
              .attr("href");
      
            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
              .then(function (dbArticle) {
                // View the added result in the console
                console.log(dbArticle);
              })
              .catch(function (err) {
                // If an error occurred, send it to the client
                return res.json(err);
              });*/
        });
    }
}
