var map;
var markers = [];
const userID = $("input[name=userID]").val();   

function getMyBreweries() {
    $.ajax({
        type: "GET",
        //url: 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=LsnXngGMPvh119GAmqLkACcXZfGcJQ3g&latlong=44.9837029,-93.1801801&radius=1000',
        url: "/api/beerConsumed/" + userID,
        async: true,
        dataType: "JSON",
        success: function (json) {
            
            reloadMarkers();
            breweries = [];
            
            var userBeers = json.result.rows;
            
            var filteredArray = userBeers.filter(beer => beer.Beer.brewery != '');
            filteredArray.map((beer, idx) => setTimeout(() => setMarkers(beer.Beer),idx * 500));

        },
        error: function (xhr, status, err) {
            // This time, we do not end up here!
        }
    });
}

function markerWindow(marker,content,infowindow){ 
    return function() {
        infowindow.setContent(content);
        infowindow.open(map,marker);
    };
}

function closeWindow(marker,infowindow){ 
    return function() {
        infowindow.close();
    };
}

function setMarkers(beers) {

    var name = beers.brewery;
    var address = beers.address;
    var city = beers.city;
    var state = beers.state;
    var phone = beers.phone;
    var website = beers.website;
    console.log();

    geocoder.geocode( { 'address': `${address}, ${city}, ${state}`}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          var marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location,
              animation: google.maps.Animation.DROP
          });

          var infowindow = new google.maps.InfoWindow();

          var content = `<p class=\'text-dark\'>Brewery: ${name}</p>
          <p class=\'text-dark\'>Address: ${address}</p>
          <p class=\'text-dark\'>Phone #: ${phone}</p>
          <p class=\'text-dark\'><a href='${website}'> Brewery Website</a></p>`;
          
  
          //google.maps.event.addListener(marker,'click', markerWindow(marker,content,infowindow));  
          //google.maps.event.addListener(marker,'mouseover', markerWindow(marker,content,infowindow));  
          google.maps.event.addListener(marker,'mousedown', markerWindow(marker,content,infowindow));  
          //google.maps.event.addListener(marker,'mouseout', closeWindow(marker, infowindow));  
          // Push marker to markers array
          markers.push(marker);
          marker.setMap(map);
        } else {
          console.log('Geocode was not successful for the following reason: ' + status);
        }
      });


    
}

function reloadMarkers() {

    // Loop through markers and set map to null for each
    for (var i=0; i<markers.length; i++) {

        markers[i].setMap(null);
    }

    // Reset the markers array
    markers = [];

    // Call set markers to re-add markers
    //setMarkers(eventLoc);
}

function codeAddress(currentBeer) {
    console.log('codeaddress executed');
    var name = currentBeer.brewery;
    var address = currentBeer.address;
    var city = currentBeer.city;
    var state = currentBeer.state;
    var phone = currentBeer.phone;
    var website = currentBeer.website;
    console.log(`${address}, ${city}, ${state}`);

    geocoder.geocode( { 'address': `${address}, ${city}, ${state}`}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            map: map,
            position: results[0].geometry.location
        });

        var infowindow = new google.maps.InfoWindow();

          var content = `<p class=\'text-dark\'>Brewery: ${name}</p>
          <p class=\'text-dark\'>Address: ${address}</p>
          <p class=\'text-dark\'>Phone #: ${phone}</p>
          <p class=\'text-dark\'><a href='${website}'> Brewery Website</a></p>`;
          
  
          //google.maps.event.addListener(marker,'click', markerWindow(marker,content,infowindow));  
          //google.maps.event.addListener(marker,'mouseover', markerWindow(marker,content,infowindow));  
          google.maps.event.addListener(marker,'mousedown', markerWindow(marker,content,infowindow));  
          //google.maps.event.addListener(marker,'mouseout', closeWindow(marker, infowindow));  
          // Push marker to markers array
          markers.push(marker);
          marker.setMap(map);
      } else {
        console.log('Geocode was not successful for the following reason: ' + status);
      }
    });
}

function initMap() {
    geocoder = new google.maps.Geocoder();
    var myLocation = { lat: 37.09024, lng: -95.712891 };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 3,
        center: myLocation
    });

    getMyBreweries();

    
/*  
    var marker = new google.maps.Marker({
        position: myLocation,
        map: map,
        animation: google.maps.Animation.DROP
    });

    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');

    setMarkers(eventLoc);
    */

    /*
    navigator.geolocation.getCurrentPosition(function (position) {
        var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        map.setCenter(latlng);
        
        //marker.setPosition(latlng);
    });*/

    //$("#reload").click(reloadMarkers);
    
}