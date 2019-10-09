import Controller from '@ember/controller';

export default Controller.extend({
  lat: 65,
  lng: -100,
  zoom: 3,

  activeDatastream: null,
  activeStation: null,

  attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',

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
