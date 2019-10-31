import Component from '@ember/component';

/*
 * Panel to display the time of the latest Observation for the station
 * that is visible in the live panels
 */
export default Component.extend({
  classNames: ['panel'],

  station: null,
  displayDateOffset: true,

  actions: {
    switchDate() {
      this.set('displayDateOffset', !this.get('displayDateOffset'));
    }
  }
});
