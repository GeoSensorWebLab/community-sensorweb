import Component from '@ember/component';

import VectorLayer from 'ol/layer/Vector';
import { Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';

/*
 * Sub-component for a vector layer on an interactive web map.
 * See the OL docs for more details:
 * https://openlayers.org/en/latest/apidoc/module-ol_layer_Vector-VectorLayer.html
 */
export default Component.extend({ 
  parentComponent: null,

  // Array of OpenLayers features for the VectorSource
  features: null,

  init() {
    this._super(...arguments);
    this.get('parentComponent').on('ready', (map) => {
      // Styling for a point feature
      let pointStyle = new Style({
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({ color: 'white' }),
          stroke: new Stroke({ color: 'blue', width: 1 })
        })
      });

      // Vector Source will support adding features after component has
      // been created.
      let source = new VectorSource({
        features: this.get('features')
      });

      let layer = new VectorLayer({
        source: source,
        style: pointStyle
      });

      map.addLayer(layer);

      // Emit an event with the source for any sub-components that are
      // waiting for the layer to be on the map.
      this.trigger('ready', source);
    });
  }
});
