import Controller from '@ember/controller';
import { A } from '@ember/array';
import Ember from 'ember';
const { Logger } = Ember;

export default Controller.extend({
  lat: 65,
  lng: -100,
  zoom: 3,

  activeStation: null,

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
    selectStation(stn) {
      let lat = stn.Location.location.coordinates[1];
      let lng = stn.Location.location.coordinates[0];

      this.set('activeStation', stn);
      this.set('forecastLinkForStation', "https://spotwx.com/products/grib_index.php?model=gem_reg_10km&lat="+ lat + "&lon=" + lng);
      Logger.log(this.activeStation);
    }
  }
});
