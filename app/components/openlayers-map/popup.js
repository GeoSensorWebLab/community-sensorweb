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

  init() {
    this._super(...arguments);
    this.get('parentComponent').on('ready', (map) => {
      let popup = new Overlay({
        element: this.$()[0],
        positioning: 'bottom-center',
        stopEvent: false,
        offset: [0, -10]
      });
      map.addOverlay(popup);

      // Set up click handler on the map to activate the "onClick" 
      // handler for the feature closest to the click.
      map.on('click', (event) => {
        let features = map.getFeaturesAtPixel(event.pixel);

        // TODO: If multiple features are near the click event, a popup
        // should be used to select one
        if (features.length > 1) {
          console.warn("Not yet supported");
        } else if (features.length == 1) {
          let feature = features[0];
          let coordinates = feature.getGeometry().getCoordinates();

          this.set('title', feature.get('title'));

          // Set the popup center coordinates *after* Ember renders 
          // the updated popup contents, otherwise the popup won't be
          // centered on the correct position.
          this.one('didRender', () => {
            popup.setPosition(coordinates);
          });

          // Activate the onClick callback for the feature component
          let onClick = feature.get('onClick');
          if (onClick) {
            onClick();
          }
        }
      });
    });
  }
});
