import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    // Use pushPayload to force this to be deserialized from SensorThings API
    // to JSON API
    this.get('store').pushPayload('thing', {
      "@iot.id": 10,
      "@iot.selfLink": "https://sensors.arcticconnect.org:6443/v1.0/Things(10)",
      "name": "Environment Canada Station MFX",
      "description": "Environment Canada Weather Station SALLUIT QC",
      "properties": {
         " STD Time Zone / Fuseau horaire heure normale": "EST",
         "# ICAO": "CMFX",
         "# MSC": "7117800",
         "# WMO": "71641",
         "#IATA": "MFX",
         "AUTO/MAN": "Auto",
         "DST Time Zone / Fuseau horaire été": "EDT",
         "EN name": "SALLUIT QC",
         "Elevation": "228",
         "FR name": "Salluit QC",
         "Latitude": "62.183333",
         "Longitude": "-75.666667",
         "Province": "QC"
      },
      "Locations@iot.navigationLink": "https://sensors.arcticconnect.org:6443/v1.0/Things(10)/Locations",
      "Datastreams@iot.navigationLink": "https://sensors.arcticconnect.org:6443/v1.0/Things(10)/Datastreams",
      "HistoricalLocations@iot.navigationLink": "https://sensors.arcticconnect.org:6443/v1.0/Things(10)/HistoricalLocations"
    });


    this.get('store').push({
      "included": [{
        "id": 11,
        "type": "location",
        "attributes": {
          "@iot.id": 11,
          "@iot.selfLink": "https://sensors.arcticconnect.org:6443/v1.0/Locations(11)",
          "name": "Environment Canada Station WUM",
          "description": "Environment Canada Weather Station FARO RCS",
          "encodingType": "application/vnd.geo+json",
          "location": {
            "coordinates": [
            -133.383333,
            62.2
            ],
            "type": "Point"
          }
        }
      },
      {
        "id": 423,
        "type": "datastream",
        "attributes": {
          "@iot.id": 423,
          "@iot.selfLink": "https://sensors.arcticconnect.org:6443/v1.0/Datastreams(423)",
          "name": "Station WUM dwpt_temp",
          "description": "Environment Canada Station WUM dwpt_temp",
          "unitOfMeasurement": {
            "definition": "",
            "name": "°C",
            "symbol": ""
          },
          "observationType": "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Observation"
        },
        "relationships": {
          "observations": {
            "data": [{
              "id": 102669,
              "type": "observation"
            },
            {
              "id": 102240,
              "type": "observation"
            },
            {
              "id": 101809,
              "type": "observation"
            },
            {
              "id": 101371,
              "type": "observation"
            }]
          }
        }
      },
      {
        "id": 102669,
        "type": "observation",
        "attributes": {
          "@iot.id": 102669,
          "@iot.selfLink": "https://sensors.arcticconnect.org:6443/v1.0/Observations(102669)",
          "phenomenonTime": "2018-05-28T21:00:00.000Z",
          "result": "-3.4",
          "Datastream@iot.navigationLink": "https://sensors.arcticconnect.org:6443/v1.0/Observations(102669)/Datastream",
          "FeatureOfInterest@iot.navigationLink": "https://sensors.arcticconnect.org:6443/v1.0/Observations(102669)/FeatureOfInterest",
          "resultTime": "2018-05-28T21:04:24.877Z"
        }
      },
      {
        "id": 102240,
        "type": "observation",
        "attributes": {
          "@iot.id": 102240,
          "@iot.selfLink": "https://sensors.arcticconnect.org:6443/v1.0/Observations(102240)",
          "phenomenonTime": "2018-05-28T20:00:00.000Z",
          "result": "-0.2",
          "Datastream@iot.navigationLink": "https://sensors.arcticconnect.org:6443/v1.0/Observations(102240)/Datastream",
          "FeatureOfInterest@iot.navigationLink": "https://sensors.arcticconnect.org:6443/v1.0/Observations(102240)/FeatureOfInterest",
          "resultTime": "2018-05-28T20:03:45.534Z"
        }
      },
      {
        "id": 101809,
        "type": "observation",
        "attributes": {
          "@iot.id": 101809,
          "@iot.selfLink": "https://sensors.arcticconnect.org:6443/v1.0/Observations(101809)",
          "phenomenonTime": "2018-05-28T19:00:00.000Z",
          "result": "1.6",
          "Datastream@iot.navigationLink": "https://sensors.arcticconnect.org:6443/v1.0/Observations(101809)/Datastream",
          "FeatureOfInterest@iot.navigationLink": "https://sensors.arcticconnect.org:6443/v1.0/Observations(101809)/FeatureOfInterest",
          "resultTime": "2018-05-28T19:01:29.040Z"
        }
      },
      {
        "id": 101371,
        "type": "observation",
        "attributes": {
          "@iot.id": 101371,
          "@iot.selfLink": "https://sensors.arcticconnect.org:6443/v1.0/Observations(101371)",
          "phenomenonTime": "2018-05-28T18:00:00.000Z",
          "result": "2.8",
          "Datastream@iot.navigationLink": "https://sensors.arcticconnect.org:6443/v1.0/Observations(101371)/Datastream",
          "FeatureOfInterest@iot.navigationLink": "https://sensors.arcticconnect.org:6443/v1.0/Observations(101371)/FeatureOfInterest",
          "resultTime": "2018-05-28T18:02:36.107Z"
        }
      }],
      "data": [{
        "id": 11,
        "type": "thing",
        "attributes": {
          "@iot.id": 11,
          "@iot.selfLink": "https://sensors.arcticconnect.org:6443/v1.0/Things(11)",
          "name": "Environment Canada Station WUM",
          "description": "Environment Canada Weather Station FARO RCS",
          "properties": {
            " STD Time Zone / Fuseau horaire heure normale": "PST",
            "# ICAO": "CWUM",
            "# MSC": "2100518",
            "# WMO": "71949",
            "#IATA": "WUM",
            "AUTO/MAN": "Auto",
            "DST Time Zone / Fuseau horaire été": "PDT",
            "EN name": "FARO RCS",
            "Elevation": "716.6",
            "FR name": "Faro",
            "Latitude": "62.2",
            "Longitude": "-133.383333",
            "Province": "YT"
          }
        },
        "relationships": {
          "locations": {
            "data": [
              {
                "id": 11,
                "type": "location"
              }
            ]
          },
          "datastreams": {
            "data": [
              {
                "id": 423,
                "type": "datastream"
              }
            ]
          }
        }
      }]
    });

    return this.get('store').peekAll('Thing');
  }
});
