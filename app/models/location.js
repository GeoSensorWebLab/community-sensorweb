import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  description: DS.attr(),
  encodingType: DS.attr(),
  location: DS.attr(),

  things: DS.hasMany('thing')
});
