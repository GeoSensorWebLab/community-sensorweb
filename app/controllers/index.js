import Controller from '@ember/controller';
import { A } from '@ember/array';
import Ember from 'ember';
const { Logger } = Ember;

export default Controller.extend({
  lat: 65,
  lng: -100,
  zoom: 3,

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
        "observationType": "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Observation"
      }]
    }
  ]),

  actions: {
    selectLocation() {
      Logger.log("HOWDY");
    }
  }
});
