
$(document).ready(function () {
    //added this outside of submit button execution so it occurs on page load
    const userID = $("input[name=userID]").val();

    function getCount(userData) {
        var counts = {};
        for (var i = 0; i < userData.rows.length; i++) {
            counts[userData.rows[i].Beer.id] = 1 + (counts[userData.rows[i].Beer.id] || 0);
        }
        console.log(counts);
        return counts;
    }

    //initialize DataTable
    var diary = $('#beerDiary').DataTable({
        "pageLength": 5,
        "scrollX": true
    });

    //Get user's beer history to add to table
    function makeTable() {
        //empty table then refill it
        diary.clear();
        $.ajax({
            url: "/api/beerConsumed/" + userID,
            type: "GET",
            dataType: "JSON"
        }).then(function (res) {

            var counts = getCount(res.result);
            console.log(counts);
            var userData = res.result.rows;
            var beerArray = [];

            for (beer in counts) {
                var count = 0;
                for (i = 0; i < userData.length; i++) {
                    if (userData[i].Beer.id == beer) { count += userData[i].rating };
                }
                var average = count / counts[beer];
                console.log(average)

                //go through list in reverse order to get most recent additions
                for (i = userData.length - 1; i > -1; i--) {
                    //push to temporary list to see if beer is already added on future adds
                    if (userData[i].Beer.id == beer && !beerArray.includes(beer)) {
                        beerArray.push(beer);
                        var currentBeer = userData[i];
                        console.log(currentBeer.updatedAt)
                        diary.row.add([
                            currentBeer.lastDrank,
                            currentBeer.Beer.name,
                            currentBeer.Beer.style,
                            currentBeer.Beer.abv,
                            currentBeer.Beer.ibu,
                            Math.round(average * 100) / 100,
                            counts[beer],
                            currentBeer.Beer.brewery
                        ]).draw();
                    };
                }

            }

        });
    }
    makeTable();

    /* this is the only code needed for the landing page */
    function initializeDate() {
        var ageDateElement = $("#ageDate");

        if (ageDateElement) {
            var d = new Date();
            var date = d.getDate();
            var legalAge = d.getFullYear() - 21;
            var monthArr = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
            ];
            var currentMonth = monthArr[d.getMonth()];
            console.log(currentMonth);

            ageDateElement.prepend(currentMonth + "  " + date + ",  " + legalAge);
        }
    }
    initializeDate();
    /* end landing page code */


    /*  Start of autosuggest/complete code */
    // Initialize ajax autocomplete:
    $('#beerAutocomplete').autocomplete({
        serviceUrl: '/autosuggest/beers/names',
        minChars: 1,
        onSelect: function (suggestion) {
            //console.log(suggestion);
            // we put the beer in the update form now in case
            // they decide to update it later and click update
            putBeerInUpdateForm(suggestion.data);
            // show the beer drank section in case they want to 
            // register an opinion
            putBeerInDrankBeerInfo(suggestion.data);
            showTheDrankBeerSection();
        }
    });

    const states = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'];
    $('#stateAutocomplete').autocomplete({
        lookup: states,
        onSelect: function (suggestion) {
            console.log(suggestion);
            /*populateSelectedBurger(suggestion.data,
                suggestion.value,
                suggestion.description);*/
        }
    });

    $('#styleAutocomplete').autocomplete({
        serviceUrl: '/autosuggest/beers/styles',
        onSelect: function (suggestion) {
            console.log(suggestion);
        }
    });

    $('#breweryAutocomplete').autocomplete({
        serviceUrl: '/autosuggest/beers/breweries',
        onSelect: function (suggestion) {
            console.log(suggestion);
            $("#address").val(suggestion.data.address);
            $("#city").val(suggestion.data.city);
            $("#stateAutocomplete").val(suggestion.data.state);
            $("#country").val(suggestion.data.country);
            $("#zipCode").val(suggestion.data.zipCode);
            $("#phone").val(suggestion.data.phone);
            $("#website").val(suggestion.data.website);
        }
    });

    const countries = [
        "Andorra",
        "Andorra Test",
        "United Arab Emirates",
        "Afghanistan",
        "Antigua and Barbuda",
        "Anguilla",
        "Albania",
        "Armenia",
        "Netherlands Antilles",
        "Angola",
        "Antarctica",
        "Argentina",
        "American Samoa",
        "Austria",
        "Australia",
        "Aruba",
        "Azerbaijan",
        "Bosnia and Herzegovina",
        "Barbados",
        "Bangladesh",
        "Belgium",
        "Burkina Faso",
        "Bulgaria",
        "Bahrain",
        "Burundi",
        "Benin",
        "Saint Barth\u00e9lemy",
        "Bermuda",
        "Brunei",
        "Bolivia",
        "British Antarctic Territory",
        "Brazil",
        "Bahamas",
        "Bhutan",
        "Bouvet Island",
        "Botswana",
        "Belarus",
        "Belize",
        "Canada",
        "Cocos [Keeling] Islands",
        "Congo - Kinshasa",
        "Central African Republic",
        "Congo - Brazzaville",
        "Switzerland",
        "Cook Islands",
        "Chile",
        "Cameroon",
        "China",
        "Colombia",
        "Costa Rica",
        "Serbia and Montenegro",
        "Canton and Enderbury Islands",
        "Cuba",
        "Cape Verde",
        "Christmas Island",
        "Cyprus",
        "Czech Republic",
        "East Germany",
        "Germany",
        "Djibouti",
        "Denmark",
        "Dominica",
        "Dominican Republic",
        "Algeria",
        "Ecuador",
        "Estonia",
        "Egypt",
        "Western Sahara",
        "Eritrea",
        "Spain",
        "Ethiopia",
        "Finland",
        "Fiji",
        "Falkland Islands",
        "Micronesia",
        "Faroe Islands",
        "French Southern and Antarctic Territories",
        "France",
        "Metropolitan France",
        "Gabon",
        "United Kingdom",
        "Grenada",
        "Georgia",
        "French Guiana",
        "Guernsey",
        "Ghana",
        "Gibraltar",
        "Greenland",
        "Gambia",
        "Guinea",
        "Guadeloupe",
        "Equatorial Guinea",
        "Greece",
        "South Georgia and the South Sandwich Islands",
        "Guatemala",
        "Guam",
        "Guinea-Bissau",
        "Guyana",
        "Hong Kong SAR China",
        "Heard Island and McDonald Islands",
        "Honduras",
        "Croatia",
        "Haiti",
        "Hungary",
        "Indonesia",
        "Ireland",
        "Israel",
        "Isle of Man",
        "India",
        "British Indian Ocean Territory",
        "Iraq",
        "Iran",
        "Iceland",
        "Italy",
        "Jersey",
        "Jamaica",
        "Jordan",
        "Japan",
        "Johnston Island",
        "Kenya",
        "Kyrgyzstan",
        "Cambodia",
        "Kiribati",
        "Comoros",
        "Saint Kitts and Nevis",
        "North Korea",
        "South Korea",
        "Kuwait",
        "Cayman Islands",
        "Kazakhstan",
        "Laos",
        "Lebanon",
        "Saint Lucia",
        "Liechtenstein",
        "Sri Lanka",
        "Liberia",
        "Lesotho",
        "Lithuania",
        "Luxembourg",
        "Latvia",
        "Libya",
        "Morocco",
        "Monaco",
        "Moldova",
        "Montenegro",
        "Saint Martin",
        "Madagascar",
        "Marshall Islands",
        "Midway Islands",
        "Macedonia",
        "Mali",
        "Myanmar [Burma]",
        "Mongolia",
        "Macau SAR China",
        "Northern Mariana Islands",
        "Martinique",
        "Mauritania",
        "Montserrat",
        "Malta",
        "Mauritius",
        "Maldives",
        "Malawi",
        "Mexico",
        "Malaysia",
        "Mozambique",
        "Namibia",
        "New Caledonia",
        "Niger",
        "Norfolk Island",
        "Nigeria",
        "Nicaragua",
        "Netherlands",
        "Norway",
        "Nepal",
        "Dronning Maud Land",
        "Nauru",
        "Neutral Zone",
        "Niue",
        "New Zealand",
        "Oman",
        "Panama",
        "Pacific Islands Trust Territory",
        "Peru",
        "French Polynesia",
        "Papua New Guinea",
        "Philippines",
        "Pakistan",
        "Poland",
        "Saint Pierre and Miquelon",
        "Pitcairn Islands",
        "Puerto Rico",
        "Palestinian Territories",
        "Portugal",
        "U.S. Miscellaneous Pacific Islands",
        "Palau",
        "Paraguay",
        "Panama Canal Zone",
        "Qatar",
        "Romania",
        "Serbia",
        "Russia",
        "Rwanda",
        "Saudi Arabia",
        "Solomon Islands",
        "Seychelles",
        "Sudan",
        "Sweden",
        "Singapore",
        "Saint Helena",
        "Slovenia",
        "Svalbard and Jan Mayen",
        "Slovakia",
        "Sierra Leone",
        "San Marino",
        "Senegal",
        "Somalia",
        "Suriname",
        "S\u00e3o Tom\u00e9 and Pr\u00edncipe",
        "Union of Soviet Socialist Republics",
        "El Salvador",
        "Syria",
        "Swaziland",
        "Turks and Caicos Islands",
        "Chad",
        "French Southern Territories",
        "Togo",
        "Thailand",
        "Tajikistan",
        "Tokelau",
        "Timor-Leste",
        "Turkmenistan",
        "Tunisia",
        "Tonga",
        "Turkey",
        "Trinidad and Tobago",
        "Tuvalu",
        "Taiwan",
        "Tanzania",
        "Ukraine",
        "Uganda",
        "U.S. Minor Outlying Islands",
        "United States",
        "Uruguay",
        "Uzbekistan",
        "Vatican City",
        "Saint Vincent and the Grenadines",
        "North Vietnam",
        "Venezuela",
        "British Virgin Islands",
        "U.S. Virgin Islands",
        "Vietnam",
        "Vanuatu",
        "Wallis and Futuna",
        "Wake Island",
        "Samoa",
        "People's Democratic Republic of Yemen",
        "Yemen",
        "Mayotte",
        "South Africa",
        "Zambia",
        "Zimbabwe"];
    $('#countryAutocomplete').autocomplete({
        lookup: countries,
        onSelect: function (suggestion) {
            console.log(suggestion);
        }
    });
    /* end of autocomplete code */



    /* Handling of which forms are presented to the user */
    const beerSearchSectionElement = $("#beerSearchSection");
    const addUpdateBeerSectionElement = $("#addUpdateBeerSection");
    const beerConsumedSectionElement = $("#beerConsumedSection");

    function showTheBeerSearch() {
        $("#beerAutocomplete").val(null);
        beerSearchSectionElement.show();
        addUpdateBeerSectionElement.hide();
        beerConsumedSectionElement.hide();
    }
    showTheBeerSearch(); // this is the initial state

    function showTheAddUpdateSection() {
        beerSearchSectionElement.hide();
        addUpdateBeerSectionElement.show();
        beerConsumedSectionElement.hide();
    }

    function showTheDrankBeerSection() {
        beerSearchSectionElement.hide();
        addUpdateBeerSectionElement.hide();
        beerConsumedSectionElement.show();
    }

    let beerSubmitElement = $("#beerSubmit");
    function setBeerFormSubmitSetText(text = "Add") {
        beerSubmitElement.text(text);
    }

    function clearBeerAddUpdateForm() {
        putBeerInUpdateForm({
            id: null,
            name: null,
            style: null,
            abv: null,
            ibu: null,
            description: null,
            brewery: null,
            address: null,
            city: null,
            state: null,
            country: null,
            zipCode: null,
            phone: null,
            website: null
        });
        setBeerFormSubmitSetText("Add");
    }

    function putBeerInUpdateForm(beer) {
        if (!beer) { throw new Error("beer input must not be null!") }
        $("#beerID").val(beer.id);
        $('#beerName').val(beer.name);
        $('#styleAutocomplete').val(beer.style);
        $('#abv').val(beer.abv);
        $('#ibu').val(beer.ibu);
        $('#description').val(beer.description);
        $('#breweryAutocomplete').val(beer.brewery);
        $('#address').val(beer.address);
        $('#city').val(beer.city);
        $('#stateAutocomplete').val(beer.state);
        $('#country').val(beer.country);
        $('#zipCode').val(beer.zipCode);
        $('#phone').val(beer.phone);
        $('#website').val(beer.website);
        setBeerFormSubmitSetText("Update");
    }

    $("#updateBeer").click(function () {
        showTheAddUpdateSection();
    });

    function putBeerInDrankBeerInfo(beer) {

        $("input[name=chosenBeerID]").val(beer.id);
        $('#chosenBeerName').text(beer.name);
        $('#chosenBeerStyle').text(beer.style);
        $('#chosenBeerABV').text(beer.abv);
        $('#chosenBeerIBU').text(beer.ibu);
        $('#chosenBeerDescription').text(beer.description);
        $('#chosenBeerBrewery').text(beer.brewery);
        $('#chosenBeerAddress').text(beer.address);
        $('#chosenBeerCity').text(beer.city);
        $('#chosenBeerState').text(beer.state);
        $('#chosenBeerCountry').text(beer.country);
        $('#chosenBeerZipCode').text(beer.zipCode);
        $('#chosenBeerPhone').text(beer.phone);
        $('#chosenBeerWebsite').text(beer.website);
        $('#chosenBeerWebsite').attr("href", beer.website);

        $("#beerRatingDropdown").val(10);
        $("#beerOpinion").val(null);
    }

    $("#beerClear").click(function () {
        clearBeerAddUpdateForm();
        showTheBeerSearch();
    });
    $("#cancelAddBeerDrank").click(function () {
        showTheBeerSearch();
    });


    $("#addBeerToggle").click(function () {
        clearBeerAddUpdateForm();
        showTheAddUpdateSection();
    });


    $('#newBeerForm').on('submit', function (e) {
        e.preventDefault();

        // after an add or update - show the drank beer section
        showTheDrankBeerSection();

        let beer = {
            id: null,
            name: '',
            style: '',
            abv: 0,
            ibu: 0,
            description: '',
            breweryName: '',
            address: '',
            city: '',
            state: '',
            country: '',
            zip: '',
            phone: '',
            website: ''
        };

        if ($('#beerName').val()) {
            beer.id = $('#beerID').val();
            beer.name = $('#beerName').val();
            beer.style = $('#styleAutocomplete').val();
            beer.abv = parseFloat($('#abv').val());
            beer.ibu = parseFloat($('#ibu').val())
            beer.description = $('#description').val();
            beer.brewery = $('#breweryAutocomplete').val();
            beer.address = $('#address').val();
            beer.city = $('#city').val();
            beer.state = $('#stateAutocomplete').val();
            beer.country = $('#country').val();
            beer.zipCode = $('#zipCode').val();
            beer.phone = $('#phone').val();
            beer.website = $('#website').val();

            //put request if beerID isn't null
            if (beer.id) {
                console.log('put request')
                $.ajax({
                    url: "/api/beers",
                    type: "PUT",
                    data: beer,
                }).then(function (res, error) {
                    console.log(res);
                    console.log('put complete;');
                    putBeerInDrankBeerInfo(beer);
                });
            }
            else {
                console.log('post request');
                $.post("/api/beers", beer)
                    .then(function (insertedID) {
                        console.log(insertedID);
                        beer.id = insertedID.id;
                        putBeerInDrankBeerInfo(beer);
                    });
            }
        }
    });

    //ajax call gets all beers consumed and unique count consumed by current user
    $.ajax({
        url: "/api/beerConsumed/" + userID,
        type: "GET",
        dataType: "JSON"
    }).then(function (res) {
        var userData = res.result;
        //console.log(userData);
        $("#numBeersDrank").text(userData.count);
        $("#numDifferentBeers").text(Object.keys(getCount(userData)).length);
    });

    $("#beerDrankForm").on("submit", function (e) {
        e.preventDefault();

        const beerID = $("input[name=chosenBeerID]").val();
        const userID = $("input[name=userID]").val();


        if (!beerID || !userID) {
            throw new Error("beerId and userID not set!");
        }

        let beerConsumed = {
            rating: $("#beerRatingDropdown").val(),
            opinion: $("#beerOpinion").val(),
            BeerId: beerID,
            UserGoogleID: userID
        };
        console.log('hi');
        console.log(beerConsumed.BeerId);

        $.post("/api/beerConsumed", beerConsumed)
            .then(function (result) {
                console.log(result);
                /* what should we do now? */
                showTheBeerSearch();
                /* AND WE NEED TO UPDATE THE HISTORY */

                //ajax call gets all beers consumed and count consumed by current user
                $.ajax({
                    url: "/api/beerConsumed/" + userID,
                    type: "GET",
                    dataType: "JSON"
                }).then(function (res) {
                    var userData = res.result;
                    var currentBeer = userData.rows[userData.rows.length - 1].Beer;
                    //console.log(userData);
                    $("#numBeersDrank").text(userData.count);
                    //Generate tally of distinct BeerId consumed by user

                    //console.log(counts);
                    //Use number of keys in above counts object to get unique beers drank
                    $("#numDifferentBeers").text(Object.keys(getCount(userData)).length);

                    makeTable();

                    codeAddress(currentBeer);
                    getMyBreweries();
                });

            });
    });

});