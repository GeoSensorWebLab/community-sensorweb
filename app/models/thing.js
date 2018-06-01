import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  name: DS.attr(),
  description: DS.attr(),
  properties: DS.attr(),

  datastreams: DS.hasMany('datastream'),
  locations: DS.hasMany('location'),

  lastLocation: computed('locations', function() {
    return this.get('locations.firstObject');
  })
});
