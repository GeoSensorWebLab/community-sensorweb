import Controller from '@ember/controller';

export default Controller.extend({
  lat: 65,
  lng: -100,
  zoom: 3,

  activeDatastream: null,
  activeStation: null,

  actions: {
    selectStation(stn) {
      let lat = stn.get('lastLocation.location.coordinates')[1];
      let lng = stn.get('lastLocation.location.coordinates')[0];

      this.set('activeStation', stn);
      this.set('activeDatastream', stn.get('airTemperature'));
      this.set('temperatureDatastream', stn.get('datastreams.firstObject'));
      this.set('forecastLinkForStation', "https://spotwx.com/products/grib_index.php?model=gem_reg_10km&lat="+ lat + "&lon=" + lng);
    }
  }
});
