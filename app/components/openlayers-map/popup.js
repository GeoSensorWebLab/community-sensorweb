import Component from '@ember/component';
import Extent from 'ol/extent';
import Overlay from 'ol/Overlay';
import {easeOut} from 'ol/easing';
/*
 * Sub-component for a popup.
 */
export default Component.extend({
  classNames: ['map-popup'],
  parentComponent: null,

  // If there are multiple features, then a different popup is rendered
  // to let the user choose between features
  multipleFeatures: null,

  // Handler for when the feature is "clicked"
  onClick: null,

  // Title for the feature, to be displayed in a popup
  title: null,

  init() {
    this._super(...arguments);
    this.get('parentComponent').on('ready', (map) => {
      let popup = new Overlay({
        autoPan: true,
        autoPanAnimation: {
          duration: 250
        },
        element: this.$()[0],
        offset: [0, -10],
        positioning: 'bottom-center',
        stopEvent: true
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
          // Create a bounding box for the features to be used in the 
          // "zoom" feature
          let allCoordinates = features.map(feature => feature.getGeometry().getCoordinates());
          let allExtent = Extent.boundingExtent(allCoordinates);
          this.set('onZoom', () => {
            let view = map.getView();
            view.fit(allExtent, {
              duration: 800,
              easing: easeOut,
              maxZoom: 14,
              padding: [50, 50, 50, 50]
            });
          });

          this.set('features', featureObjects);
          this.set('multipleFeatures', (features.length > 1));
          this.$().show();

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
  },

  actions: {
    closePopup() {
      this.$().hide();
    },

    zoomCloser() {
      this.$().hide();
      this.get('onZoom')();
    }
  }
});
