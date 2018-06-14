import Component from '@ember/component';

/*
 * Panel to display a live result view
 */
export default Component.extend({
  classNames: ['panel'],
  classNameBindings: ['isActivePanel'],

  activeDatastream: null,
  datastream: null,
  isLoading: true,

  init() {
    this._super(...arguments);
  },

  didReceiveAttrs() {
    this._super(...arguments);
    if (this.get('activeDatastream') == this.get('datastream')) {
      this.set('isActivePanel', true);
    } else {
      this.set('isActivePanel', false);
    }

    this.get('datastream').then(() => {
      this.set('isLoading', false);
    });
  }
});
