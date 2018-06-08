import Component from '@ember/component';

/*
 * Panel to display a live result view for two datastreams
 */
export default Component.extend({
  classNames: ['panel'],
  classNameBindings: ['isActivePanel'],

  activeDatastream: null,
  datastreamA: null,
  datastreamB: null,

  didReceiveAttrs() {
    this._super(...arguments);
    if (this.get('activeDatastream') == this.get('datastreamA')) {
      this.set('isActivePanel', true);
    } else {
      this.set('isActivePanel', false);
    }
  }
});
