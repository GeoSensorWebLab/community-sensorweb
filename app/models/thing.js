import DS from 'ember-data';
import { computed } from '@ember/object';

// Mapping of property names from SensorThings API to simple observed property
// categories. Arrange properties in order of most desired to least desired.
const PropertyMatchers = {
  airPressure:      [
                      'stn_pres'
                    ],
  airTemperature:   [
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
  relativeHumidity: [
                      'rel_hum',
                      'max_rel_hum_pst1hr',
                      'min_rel_hum_pst1hr'
                    ],
  visibility:       [
                      'vis',
                      'max_vis_mt50-60',
                      'min_vis_mt50-60'
                    ],
  windDirection:    [
                      'avg_wnd_dir_10m_pst1hr',
                      'avg_wnd_dir_10m_mt50-60',
                      'avg_wnd_dir_10m_mt58-60',
                      'wnd_dir_10m_pst1hr_pk_spd',
                      'wnd_dir_10m_pst1hr_max_spd',
                      'wnd_dir_10m_mt50-60_max_spd'
                    ],
  windSpeed:        [
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
const PrimaryDatastreams = [
  'airPressure', 
  'airTemperature', 
  'relativeHumidity', 
  'visibility', 
  'windDirection', 
  'windSpeed'
];

export default DS.Model.extend({
  name: DS.attr(),
  description: DS.attr(),
  properties: DS.attr(),

  datastreams: DS.hasMany('datastream', {
    $expand: 'ObservedProperty'
  }),
  locations: DS.hasMany('location', { limit: 5 }),

  // Retrieve all the observed properties to find the best one to match
  // a given observed property category.
  bestMatchByObservedProperty(property) {
    let p = new Promise((resolve, reject) => {
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
          // If it gets to this point, then no match was found.
          resolve(null);
        });
      });
    });

    return DS.PromiseObject.create({ promise: p });
  },

  airPressure: computed('datastreams.[]', function() {
    return this.bestMatchByObservedProperty('airPressure');
  }),

  airTemperature: computed('datastreams.[]', function() {
    let p = new Promise((resolve, reject) => {
      this.get('datastreams').then((datastreams) => {
        let ds = datastreams.find((datastream) => {
          return (datastream.get('observedProperty.name') === "Air Temperature");
        });
        resolve(ds);
      });
    });

    return DS.PromiseObject.create({ promise: p });
  }),

  lastLocation: computed('locations', function() {
    return this.get('locations.firstObject');
  }),

  /*
    Of the primary datastreams, find the latest observation.

    Will update when any primary datastream updates its observations.
  */
  lastUpdate: computed('primaryDatastreams.@each.observations', function() {
    let p = new Promise((resolve, reject) => {
      Promise.all(this.get('primaryDatastreams')).then((datastreams) => {
        Promise.all(datastreams.map((datastream) => {
          if (datastream) {
            return datastream.get('lastObservation');
          }
        })).then(lastObservations => {
          if (lastObservations === undefined || lastObservations.length === 0) {
            reject();
          } else {
            let sorted = lastObservations.sort((x, y) => {
              return new Date(x.get('phenomenonTime')) - new Date(y.get('phenomenonTime'));
            });

            resolve(sorted[sorted.length - 1]);
          }
        });
      });
    });
    
    return DS.PromiseObject.create({
      promise: p
    });
  }),

  /*
    Shortcut property for the primary datastreams
  */
  primaryDatastreams: computed(...PrimaryDatastreams, function() {
    return PrimaryDatastreams.map((property) => {
      return this.get(property);
    });
  }),

  relativeHumidity: computed('datastreams.[]', function() {
    return this.bestMatchByObservedProperty('relativeHumidity');
  }),

  visibility: computed('datastreams.[]', function() {
    return this.bestMatchByObservedProperty('visibility');
  }),

  windDirection: computed('datastreams.[]', function() {
    return this.bestMatchByObservedProperty('windDirection');
  }),

  windSpeed: computed('datastreams.[]', function() {
    return this.bestMatchByObservedProperty('windSpeed');
  })
});
