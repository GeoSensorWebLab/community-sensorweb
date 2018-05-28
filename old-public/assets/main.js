var chart;
var Data = {};

function getResult(station, property) {
  if (station["results"] === undefined) {
    return undefined;
  } else {
    return station["results"].find(function(e) {
      return e["name"] === property;
    });
  }
}

function last(arr) {
  if (arr === undefined) {
    return undefined;
  } else {
    return arr[arr.length - 1];
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
  if (temperature === undefined) {
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


// Load chart data for station into the chart view
function getChart(station, property) {
  $("#chart-view .waiting").css({ display: "none" });
  $("#chart-view #chart").css({ display: "block" });

  var result = getResult(station, property);

  if (chart !== undefined && chart.destroy !== undefined) {
    chart.destroy();
    chart = undefined;
  }

  if (result === undefined) {
    $("#chart").html("<h2>No data available.</h2>");
  } else {
    chart = Highcharts.stockChart('chart', {
      rangeSelector: {
        enabled: false
      },

      title: {
        text: station["name"] + " " + property
      },

      series: [{
        name: property,
        data: result["values"],
        pointStart: Date.UTC(2018, 4, 14, 22),
        pointInterval: 3600 * 1000,
        tooltip: {
          valueDecimals: 1,
          valueSuffix: result["uom"]
        }
      }]
    });
  }
}

function getLiveStats(station) {
  $("#live-view .waiting").css({ display: "none" });
  $(".update-time, .panel, .extra").css({ display: "block" });


  var date = new Date();
  $("#live-view .update-time h3").html("Last Update<br>" + date.toString());

  var temp = getResult(station, "temperature");
  if (temp !== undefined) {
    $("#live-view .panel-temp h2").html(last(temp["values"]) + " " + temp["uom"]);
  }

  var windspeed = getResult(station, "wind_speed");
  var winddir = getResult(station, "wind_direction");
  if (windspeed !== undefined && winddir !== undefined) {
    $("#live-view .panel-wind h2").html(last(windspeed["values"]) + " " + windspeed["uom"] + " " + last(winddir["values"]) + winddir["uom"]);
  }

  var pressure = getResult(station, "air_pressure");
  if (pressure !== undefined) {
    $("#live-view .panel-pressure h2").html(last(pressure["values"]) + " " + pressure["uom"]);
  }

  var humidity = getResult(station, "relative_humidity");
  if (humidity !== undefined) {
    $("#live-view .panel-humidity h2").html(last(humidity["values"]) + humidity["uom"]);
  }
}

function getMetadata(station) {
  $("#meta-view .waiting").css({ display: "none" });
  $("#meta-view .metadata").css({ display: "block" });

  $("#meta-view .metadata h2").html(station["name"]);
  $("#meta-view .metadata p").html(station["description"]);
  $("#meta-view .metadata h3 a").attr("href", getSpotWxLink(station["location"]["coordinates"][0], station["location"]["coordinates"][1]));
}

function getSpotWxLink(lon, lat) {
  return "https://spotwx.com/products/grib_index.php?model=gem_reg_10km&lat="+ lat + "&lon=" + lon;
}

$(function() {
  console.log("Ready.");
  var map = polarMap("map-view", {
    permalink: false
  });

  map.map.panTo([66, -107]);

  var stationGroup = L.layerGroup();
  map.addLayer(stationGroup);

  function loadStations() {
    Data["stations"].forEach(function(station) {
      var temp = getResult(station, "temperature");
      var winddir = getResult(station, "wind_direction");

      if (temp !== undefined) {
        var color = getColor(last(temp["values"]));
      } else {
        var color = getColor(undefined);
      }

      L.geoJson(station["location"], {
        pointToLayer: function(featureData, latlng) {
          if (winddir === undefined || last(winddir["values"]) == undefined) {
            var marker = L.circleMarker(latlng, {
              fillColor: color,
              fillOpacity: 1,
              opacity: 1,
              weight: 1
            });
          } else {
            var marker = new L.Marker.SVGMarker.RotatingMarker(latlng, {
              iconOptions: {
                circleRatio: 0,
                circleText: station["id"],
                fillColor: color,
                fillOpacity: 1,
                iconAnchor: [16, 16],
                rotation: last(winddir["values"]),
                weight: 1
              }
            });
          }

          marker.on('click', function () {
            getLiveStats(station);
            getMetadata(station);
            getChart(station, "temperature");
          });

          station.marker = marker;
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
