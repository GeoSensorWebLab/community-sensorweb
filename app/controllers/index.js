import Controller from '@ember/controller';
import { A } from '@ember/array';
import Ember from 'ember';
const { Logger } = Ember;

export default Controller.extend({
  lat: 65,
  lng: -100,
  zoom: 3,

  activeDatastream: null,
  activeStation: null,

  actions: {
    selectStation(stn) {
      let lat = stn.Location.location.coordinates[1];
      let lng = stn.Location.location.coordinates[0];

      this.set('activeStation', stn);
      this.set('activeDatastream', stn.Datastreams[0]);
      this.set('temperatureDatastream', stn.Datastreams[0]);
      this.set('forecastLinkForStation', "https://spotwx.com/products/grib_index.php?model=gem_reg_10km&lat="+ lat + "&lon=" + lng);
      Logger.log(this.activeStation);
    }
  }
});
