import Component from '@ember/component';

import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
/*
 * Sub-component for a layer on an interactive web map.
 * See the OL docs for more details:
 * https://openlayers.org/en/latest/apidoc/module-ol_layer_Tile-TileLayer.html
 */
export default Component.extend({ 
  parentComponent: null,

  // The attribution string for this layer. Will be displayed when this
  // layer is active.
  attribution: null,
  // Bounding extent for the layer, which will not be rendered outside
  // this extent. Use `ol/extent` object.
  extent: null,
  // Maximum zoom level supported by the tile server.
  maxZoom: 19,
  opacity: 1.0,
  // Projection of the tiles, defaults to Web Mercator (EPSG:3857).
  projection: 'EPSG:3857',
  // The URL for the XYZ source for this layer.
  url: null,
  visible: true,


  init() {
    this._super(...arguments);
    this.get('parentComponent').on('ready', (map) => {
      let tileLayer = new TileLayer({
        extent: this.get('extent'),
        opacity: this.get('opacity'),
        source: new XYZ({
          attributions: this.get('attribution'),
          maxZoom: this.get('maxZoom'),
          projection: this.get('projection'),
          url: this.get('url')
        }),
        visible: this.get('visible')
      });

      map.addLayer(tileLayer);
    });
  }
});
