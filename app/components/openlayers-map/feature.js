import Component from '@ember/component';
import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
/*
 * Sub-component for a feature in a VectorSource for a VectorLayer.
 * See the OL docs for more details:
 * https://openlayers.org/en/latest/apidoc/module-ol_Feature-Feature.html
 */
export default Component.extend({ 
  parentComponent: null,

  // GeoJSON representation of the feature
  geoJSON: null,

  init() {
    this._super(...arguments);
    this.get('parentComponent').on('ready', (source) => {
      let parser = new GeoJSON();
      let feature = new Feature({
        geometry: parser.readGeometry(this.get('geoJSON'), {
          featureProjection: "EPSG:3573"
        })
      });

      source.addFeature(feature);
    });
  }
});
