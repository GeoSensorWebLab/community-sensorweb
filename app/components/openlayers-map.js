import Component from '@ember/component';
import Map from 'ol/Map';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';

/*
 * Component for an interactive web map
 */
export default Component.extend({

  lat: null,
  lon: null,
  zoom: null,

  map: null,
  
  init() {
    this._super(...arguments);
  },

  /*
    The HTML element is ready and we can create the map.
   */
  didInsertElement() {
    this._super(...arguments);

    let map = new Map({
      target: this.element.id,
      layers: [],
      view: new View({
        center: fromLonLat([this.get('lon'), this.get('lat')]),
        zoom: this.get('zoom')
      })
    });

    this.set('map', map);
    // Pass an event to any sub-components waiting for the Map element
    // to be ready.
    this.trigger('mapReady', map);
  }
});
