import Component from '@ember/component';

/*
 * Panel to display a live result view for two wind-related datastreams
 */
export default Component.extend({
  classNames: ['panel'],
  classNameBindings: ['isActivePanel'],

  activeDatastream: null,
  speed: null,
  direction: null,

  didReceiveAttrs() {
    this._super(...arguments);
    if (this.get('activeDatastream') == this.get('speed')) {
      this.set('isActivePanel', true);
    } else {
      this.set('isActivePanel', false);
    }
  }
});
