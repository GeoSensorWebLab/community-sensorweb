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

  // Handler for when the feature is "clicked"
  onClick: null,

  // Title for the feature, to be displayed in a popup
  title: null,

  init() {
    this._super(...arguments);
    this.get('parentComponent').on('ready', (source) => {
      let parser = new GeoJSON();

      // An OpenLayers Feature can have arbitrary properties that can
      // be accessed by handlers.
      let feature = new Feature({
        geometry: parser.readGeometry(this.get('geoJSON'), {
          featureProjection: "EPSG:3573"
        }),
        onClick: this.get('onClick'),
        title: this.get('title')
      });

      source.addFeature(feature);
    });
  }
});
