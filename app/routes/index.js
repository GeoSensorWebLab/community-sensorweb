import Route from '@ember/routing/route';
import { A } from '@ember/array';

export default Route.extend({
  model() {
    return {
      Things: A([
        {
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
          },

          // Hack to give a shortcut to first Location by accessing `.Location`
          "Location": {
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
          },

          "Datastreams": [{
            "@iot.id": 423,
            "@iot.selfLink": "https://sensors.arcticconnect.org:6443/v1.0/Datastreams(423)",
            "name": "Station WUM dwpt_temp",
            "description": "Environment Canada Station WUM dwpt_temp",
            "unitOfMeasurement": {
              "definition": "",
              "name": "°C",
              "symbol": ""
            },
            "observationType": "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Observation",
            // Hack to give a shortcut to latest Observation
            "LastObservation": {
              "@iot.id": 102669,
              "@iot.selfLink": "https://sensors.arcticconnect.org:6443/v1.0/Observations(102669)",
              "phenomenonTime": "2018-05-28T21:00:00.000Z",
              "result": "-3.4",
              "Datastream@iot.navigationLink": "https://sensors.arcticconnect.org:6443/v1.0/Observations(102669)/Datastream",
              "FeatureOfInterest@iot.navigationLink": "https://sensors.arcticconnect.org:6443/v1.0/Observations(102669)/FeatureOfInterest",
              "resultTime": "2018-05-28T21:04:24.877Z"
            },
            "Observations": [
              {
                "@iot.id": 102669,
                "@iot.selfLink": "https://sensors.arcticconnect.org:6443/v1.0/Observations(102669)",
                "phenomenonTime": "2018-05-28T21:00:00.000Z",
                "result": "-3.4",
                "Datastream@iot.navigationLink": "https://sensors.arcticconnect.org:6443/v1.0/Observations(102669)/Datastream",
                "FeatureOfInterest@iot.navigationLink": "https://sensors.arcticconnect.org:6443/v1.0/Observations(102669)/FeatureOfInterest",
                "resultTime": "2018-05-28T21:04:24.877Z"
              }, {
                "@iot.id": 102240,
                "@iot.selfLink": "https://sensors.arcticconnect.org:6443/v1.0/Observations(102240)",
                "phenomenonTime": "2018-05-28T20:00:00.000Z",
                "result": "-0.2",
                "Datastream@iot.navigationLink": "https://sensors.arcticconnect.org:6443/v1.0/Observations(102240)/Datastream",
                "FeatureOfInterest@iot.navigationLink": "https://sensors.arcticconnect.org:6443/v1.0/Observations(102240)/FeatureOfInterest",
                "resultTime": "2018-05-28T20:03:45.534Z"
              }, {
                "@iot.id": 101809,
                "@iot.selfLink": "https://sensors.arcticconnect.org:6443/v1.0/Observations(101809)",
                "phenomenonTime": "2018-05-28T19:00:00.000Z",
                "result": "1.6",
                "Datastream@iot.navigationLink": "https://sensors.arcticconnect.org:6443/v1.0/Observations(101809)/Datastream",
                "FeatureOfInterest@iot.navigationLink": "https://sensors.arcticconnect.org:6443/v1.0/Observations(101809)/FeatureOfInterest",
                "resultTime": "2018-05-28T19:01:29.040Z"
              }, {
                "@iot.id": 101371,
                "@iot.selfLink": "https://sensors.arcticconnect.org:6443/v1.0/Observations(101371)",
                "phenomenonTime": "2018-05-28T18:00:00.000Z",
                "result": "2.8",
                "Datastream@iot.navigationLink": "https://sensors.arcticconnect.org:6443/v1.0/Observations(101371)/Datastream",
                "FeatureOfInterest@iot.navigationLink": "https://sensors.arcticconnect.org:6443/v1.0/Observations(101371)/FeatureOfInterest",
                "resultTime": "2018-05-28T18:02:36.107Z"
              }
            ]
          }]
        }
      ]),
    };
  }
});
