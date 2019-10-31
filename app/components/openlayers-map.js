import Component from '@ember/component';
import Map from 'ol/Map';
import View from 'ol/View';
import { transform } from 'ol/proj';

/*
 * Component for an interactive web map
 */
export default Component.extend({
  lat: null,
  lon: null,
  // Maximum zoom level permitted by the map, regardless of tile layer
  // settings.
  maxZoom: 19,
  projection: 'EPSG:3857',
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

    let projection = this.get('projection');

    let map = new Map({
      target: this.element.id,
      layers: [],
      view: new View({
        center: transform([this.get('lon'), this.get('lat')], 'EPSG:4326', projection),
        maxZoom: this.get('maxZoom'),
        projection: projection,
        zoom: this.get('zoom')
      })
    });

    this.set('map', map);
    // Pass an event to any sub-components waiting for the Map element
    // to be ready.
    this.trigger('ready', map);
  }
});
