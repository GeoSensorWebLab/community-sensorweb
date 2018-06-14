import DS from 'ember-data';
import { computed } from '@ember/object';

// Mapping of property names from SensorThings API to simple observed property
// categories. Arrange properties in order of most desired to least desired.
const PropertyMatchers = {
  airPressure:  [
                  'stn_pres'
                ],
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
                  ],
  windDirection:  [
                    'avg_wnd_dir_10m_pst1hr',
                    'avg_wnd_dir_10m_mt50-60',
                    'avg_wnd_dir_10m_mt58-60',
                    'wnd_dir_10m_pst1hr_pk_spd',
                    'wnd_dir_10m_pst1hr_max_spd',
                    'wnd_dir_10m_mt50-60_max_spd'
                  ],
  windSpeed:  [
                'avg_wnd_spd_10m_pst1hr',
                'avg_wnd_spd_10m_mt50-60',
                'avg_wnd_spd_10m_mt58-60',
                'avg_wnd_spd_pcpn_gag_mt50-60',
                'max_pk_wnd_spd_10m_pst1hr',
                'max_wnd_spd_10m_pst1hr',
                'max_wnd_gst_spd_10m_mt50-60',
                'max_wnd_spd_10m_mt50-60'
              ]
};

export default DS.Model.extend({
  name: DS.attr(),
  description: DS.attr(),
  properties: DS.attr(),

  datastreams: DS.hasMany('datastream', { limit: 100 }),
  locations: DS.hasMany('location', { limit: 5 }),

  // Retrieve all the observed properties to find the best one to match
  // a given observed property category.
  bestMatchByObservedProperty(property) {
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
          for (let i = 0; i < PropertyMatchers[property].length; i++) {
            let p = PropertyMatchers[property][i];
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
  },

  airPressure: computed('datastreams.[]', function() {
    return this.bestMatchByObservedProperty('airPressure');
  }),

  airTemperature: computed('datastreams.[]', function() {
    return this.bestMatchByObservedProperty('airTemperature');
  }),

  lastLocation: computed('locations', function() {
    return this.get('locations.firstObject');
  }),

  windDirection: computed('datastreams.[]', function() {
    return this.bestMatchByObservedProperty('windDirection');
  }),

  windSpeed: computed('datastreams.[]', function() {
    return this.bestMatchByObservedProperty('windSpeed');
  })
});
