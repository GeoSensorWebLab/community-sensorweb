import DS from 'ember-data';
import { computed } from '@ember/object';

// Mapping of property names from SensorThings API to simple observed property
// categories. Arrange properties in order of most desired to least desired.
const PropertyMatchers = {
  airTemperature: [
                    'air_temp',
                    'avg_air_temp_pst1hr',
                    'max_air_temp_pst1hr',
                    'min_air_temp_pst1hr',
                    'max_air_temp_pst6hrs',
                    'min_air_temp_pst6hrs',
                    'air_temp_12hrs_ago',
                    'max_air_temp_pst24hrs',
                    'min_air_temp_pst24hrs'
                  ]
};

export default DS.Model.extend({
  name: DS.attr(),
  description: DS.attr(),
  properties: DS.attr(),

  datastreams: DS.hasMany('datastream'),
  locations: DS.hasMany('location'),

  // Retrieve all the observed properties to find the best one to match
  // air temperature.
  airTemperature: computed('datastreams.[]', function() {
    let p = new Promise((resolve) => {
      this.get('datastreams').then(datastreams => {

        // Map the Observed Property names to Datastream models.
        // Because this goes over an async relationship, we are actually
        // creating an array of Promises.
        let maps = datastreams.map(datastream => {
          return datastream.get('observedProperty').then((op) => {
            return [op.get('name'), datastream];
          });
        });

        // Once all the promises have been resolved, check each observed
        // property name against the PropertyMatcher list *in order*, breaking
        // on the first match. This ensures that only a single resolve is
        // called.
        Promise.all(maps).then((maps) => {
          for (let i = 0; i < PropertyMatchers.airTemperature.length; i++) {
            let p = PropertyMatchers.airTemperature[i];
            let match = maps.find((map) => {
              return map[0] === p;
            });

            if (match) {
              resolve(match[1]);
              return;
            }
          }
        });
      });
    });

    return DS.PromiseObject.create({ promise: p });
  }),

  lastLocation: computed('locations', function() {
    return this.get('locations.firstObject');
  })
});
