import DS from 'ember-data';

export default DS.Model.extend({
  phenomenonTime: DS.attr(),
  result: DS.attr(),
  resultTime: DS.attr(),

  datastream: DS.belongsTo('datastream')
});
