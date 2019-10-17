import Component from '@ember/component';
import { computed } from '@ember/object';

/*
 * Panel to display a live result view
 */
export default Component.extend({
  classNames: ['panel'],
  classNameBindings: ['isActivePanel'],

  activeDatastream: null,
  datastream: null,

  isUnavailable: true,

  didReceiveAttrs() {
    this._super(...arguments);

    // As the datastream is loaded asynchronously through a Promise,
    // we have to use a `then` here to wait to update the local status.
    // When these component properties are updated, then the component
    // will automatically re-render.
    this.get('datastream').then((datastream) => {
      this.set('isUnavailable', (datastream === undefined));
    })
  },

  isActivePanel: computed('datastream', 'activeDatastream', function () {
    return (this.get('activeDatastream') === this.get('datastream'));
  })
});
