import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  description: DS.attr(),
  definition: DS.attr(),

  datastreams: DS.hasMany('datastream')
});
