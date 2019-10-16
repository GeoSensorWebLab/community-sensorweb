import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  name: DS.attr(),
  description: DS.attr(),
  properties: DS.attr(),

  datastreams: DS.hasMany('datastream', {
    $expand: 'ObservedProperty'
  }),
  locations: DS.hasMany('location', { limit: 5 }),

  // Retrieve the Datastreams for this Thing and find the Datastream
  // with an Observed Property name matching `propertyName`.
  getDatastreamByProperty(propertyName) {
    let p = new Promise((resolve, reject) => {
      this.get('datastreams').then((datastreams) => {
        let ds = datastreams.find((datastream) => {
          return (datastream.get('observedProperty.name') === propertyName);
        });

        resolve(ds);
      }, (err) => { reject(err); });
    });

    return DS.PromiseObject.create({ promise: p });
  },

  lastLocation: computed('locations', function() {
    return this.get('locations.firstObject');
  }),

  /*
    Retrieve all the cached Datastreams, then the latest Observation for
    each Datastream. Return the most recent Observation phenomenonTime.
  */
  latestObservation: computed('primaryDatastreams', function() {
    let p = new Promise((resolve, reject) => {
      this.get('primaryDatastreams').then((datastreams) => {
        // As the Datastreams may not be ready yet, we have to use
        // Promise.all to resolve them before continuing.
        Promise.all(datastreams.map((datastream) => {
          // Ignore unavailable Datastreams
          if (datastream) {
            return datastream.get('lastObservation');
          }
        })).then(lastObservations => {
          if (lastObservations === undefined || lastObservations.length === 0) {
            reject();
          } else {
            let sorted = lastObservations.filter((obs) => {
              return obs !== undefined;
            }).sort((x, y) => {
              return new Date(x.get('phenomenonTime')) - new Date(y.get('phenomenonTime'));
            });

            if (sorted.length > 0) {
              resolve(sorted[sorted.length - 1]);
            }
          }
        }, (err) => { reject(err); });
      }, (err) => { reject(err); });
    });
    
    return DS.PromiseObject.create({
      promise: p
    });
  }),

  /*
    Shortcut property for the primary datastreams
  */
 
  primaryDatastreams: computed('datastreams.[]', function() {
    let p = Promise.all([
      this.get('airPressure'),
      this.get('airTemperature'),
      this.get('relativeHumidity'),
      this.get('visibility'),
      this.get('windDirection'),
      this.get('windSpeed'),
    ]);

    return DS.PromiseObject.create({
      promise: p
    });
  }),
 
  airPressure: computed('datastreams.[]', function() {
    return this.getDatastreamByProperty('Station Pressure');
  }),

  airTemperature: computed('datastreams.[]', function() {
    return this.getDatastreamByProperty('Air Temperature');
  }),

  relativeHumidity: computed('datastreams.[]', function() {
    return this.getDatastreamByProperty('Relative Humidity');
  }),

  visibility: computed('datastreams.[]', function() {
    return this.getDatastreamByProperty('Visibility');
  }),

  windDirection: computed('datastreams.[]', function() {
    return this.getDatastreamByProperty('Vectoral average 10 meter wind direction over past 10 minutes');
  }),

  windSpeed: computed('datastreams.[]', function() {
    return this.getDatastreamByProperty('Average 10 meter wind speed over past 10 minutes');
  })
});
