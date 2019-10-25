import Component from '@ember/component';
import Overlay from 'ol/Overlay';
/*
 * Sub-component for a popup.
 */
export default Component.extend({
  classNames: ['map-popup'],
  parentComponent: null,

  // Handler for when the feature is "clicked"
  onClick: null,

  // Title for the feature, to be displayed in a popup
  title: null,

  // If there are multiple features, then a different popup is rendered
  // to let the user choose between features
  multipleFeatures: null,

  init() {
    this._super(...arguments);
    this.get('parentComponent').on('ready', (map) => {
      let popup = new Overlay({
        element: this.$()[0],
        positioning: 'bottom-center',
        stopEvent: true,
        offset: [0, -10]
      });
      map.addOverlay(popup);

      // Set up click handler on the map to activate the "onClick" 
      // handler for the feature closest to the click.
      // Note that setting properties on the components will cause the
      // popup to draw, so don't set properties if there are no features
      // to draw.
      map.on('click', (event) => {
        let features = map.getFeaturesAtPixel(event.pixel);
        // convert to feature objects for the template
        let featureObjects = features.map(feature => feature.getProperties());

        if (features.length > 0) {
          this.set('features', featureObjects);
          this.set('multipleFeatures', (features.length > 1));

          let feature = features[0];
          let coordinates = feature.getGeometry().getCoordinates();

          // Set the popup center coordinates *after* Ember renders 
          // the updated popup contents, otherwise the popup won't be
          // centered on the correct position.
          this.one('didRender', () => {
            popup.setPosition(coordinates);
          });
        }

        // Activate the onClick callback for the feature component
        if (features.length === 1) {
          let onClick = features[0].get('onClick');
          if (onClick) {
            onClick();
          }
        }
      });
    });
  }
});
