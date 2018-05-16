$(function() {
  console.log("Ready.");
  var map = polarMap("map-view");

  var stationGroup = L.layerGroup();
  map.addLayer(stationGroup);

  // Load Stations
  $.getJSON("/assets/sample-data.json", function(data) {
    data["stations"].forEach(function(element) {
      L.geoJson(element["location"]).addTo(stationGroup);
    });
  });
});
