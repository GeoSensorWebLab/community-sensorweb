import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  name: DS.attr(),
  description: DS.attr(),
  unitOfMeasurement: DS.attr(),
  observationType: DS.attr(),

  observations: DS.hasMany('observation', { $top: 10 }),
  observedProperty: DS.belongsTo('observed-property'),
  thing: DS.belongsTo('thing'),

  /*
    Execute a custom query to SensorThings API to return up to 50 
    Observations from this Datastream for the past 24 hours, based on
    the `phenomenonTime`.
  */
  recentObservations() {
    let oneDayAgo = new Date(new Date() - 86400 * 1000);

    return this.get('store').query('observation', {
      parent: {
        id: this.get('id'),
        modelName: 'datastream'
      },
      $top: 50,
      $orderby: 'phenomenonTime desc',
      $filter: 'phenomenonTime ge ' + oneDayAgo.toISOString()
    });
  },

  // Computed Properties

  /*
    Sort Observations in ascending phenomenonTime order
  */
  sortedObservations: computed('observations.[]', function() {
    return this.get('observations').then((observations) => {
      return observations.sortBy('phenomenonTime');
    });
  }),

  // Select the newest Observation in this Datastream, and return a
  // PromiseObject.
  lastObservation: computed('sortedObservations', function() {
    let p = new Promise((resolve) => {
      this.get('sortedObservations').then((observations) => {
        resolve(observations.get('lastObject'));
      });
    });

    return DS.PromiseObject.create({
      promise: p
    });
  })
});
