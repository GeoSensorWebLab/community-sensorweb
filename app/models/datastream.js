import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  name: DS.attr(),
  description: DS.attr(),
  unitOfMeasurement: DS.attr(),
  observationType: DS.attr(),

  observations: DS.hasMany('observation', { limit: 10 }),
  observedProperty: DS.belongsTo('observed-property'),
  thing: DS.belongsTo('thing'),

  // Computed Properties

  lastObservation: computed('observations', function() {
    return this.get('observations.firstObject');
  })
});
