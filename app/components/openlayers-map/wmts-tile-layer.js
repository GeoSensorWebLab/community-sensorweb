import Component from '@ember/component';

import TileLayer from 'ol/layer/Tile';
import WMTS from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import { getWidth, getTopLeft } from 'ol/extent';
import { get as getProjection } from 'ol/proj';
/*
 * Sub-component for a WMTS layer on an interactive web map.
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
  opacity: 1.0,
  // Projection of the tiles, defaults to Web Mercator (EPSG:3857).
  projection: 'EPSG:3857',
  // The URL for the XYZ source for this layer.
  url: null,
  visible: true,


  init() {
    this._super(...arguments);

    let projection = getProjection(this.get('projection'));
    // let projectionExtent = projection.getExtent();
    let projectionExtent = [-4889334.2315287357196212, -4889298.2317267144098878, 4889169.6617264701053500, 4889277.6604509428143501];
    let size = getWidth(projectionExtent) / 256;

    let resolutions = [];
    let matrixIds = [];

    for (let z = 0; z < 14; z++) {
      // generate resolutions and matrixIds arrays for this WMTS
      resolutions[z] = size / Math.pow(2, z);
      matrixIds[z] = z;
    }

    this.get('parentComponent').on('ready', (map) => {
      let tileLayer = new TileLayer({
        // extent: this.get('extent'),
        opacity: this.get('opacity'),
        source: new WMTS({
          attributions: this.get('attribution'),
          projection: this.get('projection'),
          url: this.get('url'),
          layer: 'awm2',
          matrixSet: 'laea3573',
          format: 'image/png',
          wrapX: false,
          style: 'default',
          tileGrid: new WMTSTileGrid({
            origin: getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: matrixIds

          })
        }),
        visible: this.get('visible')
      });

      map.addLayer(tileLayer);
    });
  }
});
