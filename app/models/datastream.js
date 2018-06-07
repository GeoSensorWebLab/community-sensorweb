import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  name: DS.attr(),
  description: DS.attr(),
  unitOfMeasurement: DS.attr(),
  observationType: DS.attr(),

  thing: DS.belongsTo('thing'),
  observations: DS.hasMany('observation'),
  observedProperty: DS.belongsTo('observed-property'),

  // Computed Properties

  lastObservation: computed('observations', function() {
    return this.get('observations.firstObject');
  })
});
