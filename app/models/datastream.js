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
    let observations = this.get('observations');
    return observations.toArray().sort((x, y) => {
      return new Date(x.get('phenomenonTime')) - new Date(y.get('phenomenonTime'));
    });
  }).readOnly(),

  lastObservation: computed('sortedObservations', function() {
    return this.get('sortedObservations.lastObject');
  }).readOnly()
});
