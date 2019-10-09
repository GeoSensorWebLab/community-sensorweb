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

  isActivePanel: computed('datastream', 'activeDatastream', function () {
    return (this.get('activeDatastream') === this.get('datastream'));
  })
});
