const link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// request URL
d3.json(link, function(data) {
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // popups for each feature
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3> Location: " + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<br><h2> Magnitude: " + feature.properties.mag + "</h2>");
  }

  // GeoJSON layer
  function createCircleMarker(feature,latlng){
    let options = {
        radius:feature.properties.mag*5,
        fillColor: chooseColor(feature.properties.mag),
        color: chooseColor(feature.properties.mag),
        weight: 1,
        opacity: .8,
        fillOpacity: 0.35
    }
    return L.circleMarker(latlng, options);
}
  
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: createCircleMarker
  });
  
  // Send earthquakes layer to the createMap function
  createMap(earthquakes);
}

// Color circles based on mag
function chooseColor(mag) {
  switch(true) {
      case (1.0 <= mag && mag <= 2.5):
        return "#BC0000 ";
      case (2.5 <= mag && mag <= 4.0):
        return "#BC3500";
      case (4.0 <= mag && mag <= 5.5):
        return "#BCBC00";
      case (5.5 <= mag && mag <= 7.0):
        return "#35BC00 ";
      case (7.0 <= mag && mag <= 20.0):
        return "#0071BC";
      default:
        return "#E2FFAE";
  }
}

let legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'info legend'),
        grades = [1.0, 2.5, 4.0, 5.5, 7.0],
        labels = [];

    return div;
};
 
function createMap(earthquakes) {

// define tile layer
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Define a baseMaps object to hold our base layers
  let baseMaps = {
    "Street Map": streetmap
  };

  // Create overlay object to hold our overlay layer
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create map
  let myMap = L.map("map", {
    center: [
      39.8282, -98.5795
    ],
    zoom: 4,
    layers: [streetmap, earthquakes]
  });
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);
  legend.addTo(myMap);
}