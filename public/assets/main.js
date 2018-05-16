var Data = {};

function getResult(station, property) {
  if (station["results"] === undefined) {
    return { "value": null };
  } else {
    return station["results"].find(function(e) {
      return e["name"] === property;
    });
  }
}

var colourRamp = {
  "-50": "#313695",
  "-35": "#4575b4",
  "-20": "#74add1",
  "-5": "#abd9e9",
  "0": "#e0f3f8",
  "5": "#fee090",
  "20": "#fdae61",
  "35": "#f46d43",
  "50": "#d73027"
};

function interpolate(target, lower, upper) {
  var l = colourRamp[lower];
  var u = colourRamp[upper];
  var mod = (upper - target) / (upper - lower);
  var invMod = 1 - mod;

  var r = invMod * parseInt(l.substr(1,2), 16) + mod * parseInt(u.substr(1,2), 16);
  var g = invMod * parseInt(l.substr(3,2), 16) + mod * parseInt(u.substr(3,2), 16);
  var b = invMod * parseInt(l.substr(5,2), 16) + mod * parseInt(u.substr(5,2), 16);
  return "#" + Math.floor(r).toString(16) + Math.floor(g).toString(16) + Math.floor(b).toString(16);
}

function getColor(temperature) {
  if (temperature === null) {
    return '#AAA';
  } else if (colourRamp[temperature.toString()] !== undefined) {
    return colourRamp[temperature];
  } else {
    var keys = Object.keys(colourRamp).sort(function(a, b) { return parseInt(a) > parseInt(b); });
    var lower = keys.findIndex(function(e) { return e < temperature; });
    var upper = keys.findIndex(function(e) { return e > temperature; });

    if (lower === -1) {
      return colourRamp["-50"];
    } else if (upper === -1) {
      return colourRamp["50"];
    } else {
      return interpolate(temperature, keys[upper -1], keys[upper]);
    }
  }
}

function getLiveStats(station) {
  $("#live-view .waiting").css({ display: "none" });
  $(".update-time, .panel, .extra").css({ display: "block" });


  var date = new Date();
  $("#live-view .update-time h3").html("Last Update<br>" + date.toString());

  var temp = getResult(station, "temperature");
  $("#live-view .panel-temp h2").html(temp["value"] + " " + temp["uom"]);

  var windspeed = getResult(station, "wind_speed");
  var winddir = getResult(station, "wind_direction");
  $("#live-view .panel-wind h2").html(windspeed["value"] + " " + windspeed["uom"] + " " + winddir["value"] + winddir["uom"]);

  var pressure = getResult(station, "air_pressure");
  $("#live-view .panel-pressure h2").html(pressure["value"] + " " + pressure["uom"]);

  var humidity = getResult(station, "relative_humidity");
  $("#live-view .panel-humidity h2").html(humidity["value"] + humidity["uom"]);
}


$(function() {
  console.log("Ready.");
  var map = polarMap("map-view");

  var stationGroup = L.layerGroup();
  map.addLayer(stationGroup);

  function loadStations() {
    Data["stations"].forEach(function(element) {
      if (element["results"] === undefined) {
        var temp = { "value": null };
      } else {
        var temp = element["results"].find(function(e) {
          return e["name"] === "temperature";
        });
      }

      L.geoJson(element["location"], {
        pointToLayer: function(featureData, latlng) {
          var marker = L.circleMarker(latlng, {
            fillColor: getColor(temp["value"]),
            fillOpacity: 1,
            opacity: 1
          });

          marker.on('click', function () {
            getLiveStats(element);
          });

          element.marker = marker;
          return marker;
        }
      }).addTo(stationGroup);
    });
  }

  // Download Stations
  $.getJSON("/assets/sample-data.json", function(data) {
    Data["stations"] = data["stations"];
    loadStations();
  });
});
