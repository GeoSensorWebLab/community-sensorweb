import Component from '@ember/component';

/*
 * Sub-component for a layer on an interactive web map
 */
export default Component.extend({ 
  parentComponent: null,

  init() {
    this._super(...arguments);
  }
});
