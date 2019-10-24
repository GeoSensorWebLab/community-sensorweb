import Component from '@ember/component';
import Overlay from 'ol/Overlay';
import Map from 'ol/Map';
import View from 'ol/View';
import { transform } from 'ol/proj';

/*
 * Component for an interactive web map
 */
export default Component.extend({

  lat: null,
  lon: null,
  zoom: null,

  map: null,
  projection: 'EPSG:3857',
  
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
        projection: projection,
        zoom: this.get('zoom')
      })
    });

    // Grab the "popup" element and link it to an OpenLayers Overlay
    // TODO: Extract to Component
    let popup = new Overlay({
      element: this.$("#map-popup")[0],
      positioning: 'bottom-center',
      stopEvent: false,
      offset: [0, -10]
    });
    map.addOverlay(popup);

    // Set up click handler on the map to activate the "onClick" handler
    // for the feature closest to the click.
    map.on('click', (event) => {
      let features = map.getFeaturesAtPixel(event.pixel);

      // TODO: If multiple features are near the click event, a popup
      // should be used to select one
      if (features.length > 1) {
        console.warn("Not yet supported");
      } else if (features.length == 1) {
        let feature = features[0];
        let coordinates = feature.getGeometry().getCoordinates();

        
        let $popup = this.$(popup.getElement());
        $popup.find(".title").html(feature.get('title'));

        // Set the popup center coordinates *after* updating the popup
        // contents, otherwise the popup won't be centered on the correct
        // position.
        popup.setPosition(coordinates);

        // Activate the onClick callback for the feature component
        let onClick = feature.get('onClick');
        if (onClick) {
          onClick();
        }
      }
    });

    this.set('map', map);
    // Pass an event to any sub-components waiting for the Map element
    // to be ready.
    this.trigger('mapReady', map);
  }
});
