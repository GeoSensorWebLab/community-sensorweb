import Component from '@ember/component';

import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
/*
 * Sub-component for a layer on an interactive web map
 */
export default Component.extend({ 
  parentComponent: null,

  label: null,
  // The tile loading URL for this layer.
  url: null,
  // The attribution string for this layer. Will be displayed when this
  // layer is active.
  attribution: null,

  init() {
    this._super(...arguments);
    this.get('parentComponent').on('mapReady', (map) => {
      let tileLayer = new TileLayer({
        source: new XYZ({
          attributions: this.get('attribution'),
          url: this.get('url')
        })
      });

      map.addLayer(tileLayer);
    });
  }
});
