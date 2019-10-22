import Controller from '@ember/controller';

import {register} from 'ol/proj/proj4';
import proj4 from 'proj4';

// Register the custom projection for ArcticWebMap here.
// This must be defined by Proj4 then registered by OpenLayers *before*
// the OpenLayers map component is created.
proj4.defs("EPSG:3573","+proj=laea +lat_0=90 +lon_0=-100 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs");
register(proj4);

export default Controller.extend({
  // Default location for the map.
  // This will automatically be transformed from latitude/longitude (aka
  // EPSG:4326) to the appropriate projection for the map.
  lat: 65,
  lon: -100,
  zoom: 4,

  activeDatastream: null,
  activeStation: null,

  actions: {
    selectStation(stn) {
      let lat = stn.get('lastLocation.location.coordinates')[1];
      let lng = stn.get('lastLocation.location.coordinates')[0];

      this.set('activeStation', stn);
      this.set('activeDatastream', stn.get('airTemperature'));
      this.set('temperatureDatastream', stn.get('airTemperature'));
      this.set('forecastLinkForStation', "https://spotwx.com/products/grib_index.php?model=gem_reg_10km&lat="+ lat + "&lon=" + lng);
    }
  }
});
