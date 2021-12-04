// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

//  Define tile layer
var baseMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
});

// Create our map
var myMap = L.map("map", {
  center: [
    37.09, -108.71
  ],
  zoom: 5,
  layers: [baseMap]
});

function getColor(magnitude){
  switch (true) {
    case magnitude >= 0 && magnitude < 1:
      return "#80ff00";
    case magnitude >= 1 && magnitude < 2:
      return "#bfff00";
    case magnitude >= 2 && magnitude < 3:
        return "#ffcc00";
    case magnitude >= 3 && magnitude < 4:
        return "#ff9900";
    case magnitude >= 4 && magnitude < 5:
        return "#ff6600";
    case magnitude >= 5:
      return "#ff0000";
    default:
      return "#000000";
  };
 };

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  // Get the response
  earthquake_data = data.features;
  // Add circles to map
  earthquake_data.forEach(function(site){
  var longitude = site.geometry.coordinates[0];
  var latitude = site.geometry.coordinates[1];
  var i = L.circle([latitude, longitude], {
    fillOpacity: 0.75,
    fillColor: getColor(site.properties.mag),
    color: "#000000",
    weight: "1",
   // Adjust radius
   radius: site.properties.mag * 25000
   // Add the pop up
   }).bindPopup("<h1>" + "Location: " + site.properties.place + "</h1>" + "<h1>" + "Magnitude: " + site.properties.mag + "</h1>").addTo(myMap);
  });

  // Add a legend
  var legend = L.control({position: 'bottomright'});
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
    magnitude_tiers = [0,1,2,3,4,5]
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magnitude_tiers.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(magnitude_tiers[i]) + '"></i> ' +
            magnitude_tiers[i] + (magnitude_tiers[i + 1] ? '&ndash;' + magnitude_tiers[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(myMap);
});

// Use this link to get the geojson data.
var link = "static/js/GeoJSON/PB2002_boundaries.json";
// Grabbing our GeoJSON data..
d3.json(link).then(function(data) {
  // Creating a GeoJSON layer with the retrieved data
  var fault_lines = L.geoJson(data, {
    color: "#ff9900",
    weight: 2
  });
  // Add the the map
  fault_lines.addTo(myMap);
});

