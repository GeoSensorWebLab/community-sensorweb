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
      });
    });

    return DS.PromiseObject.create({ promise: p });
  },

  lastLocation: computed('locations', function() {
    return this.get('locations.firstObject');
  }),

  /*
    Of the primary datastreams, find the latest observation.

    Will update when any primary datastream updates its observations.
  */
  lastUpdate: computed('primaryDatastreams.@each.observations', function() {
    // let p = new Promise((resolve, reject) => {
    //   Promise.all(this.get('primaryDatastreams')).then((datastreams) => {
    //     Promise.all(datastreams.map((datastream) => {
    //       if (datastream) {
    //         return datastream.get('lastObservation');
    //       }
    //     })).then(lastObservations => {
    //       if (lastObservations === undefined || lastObservations.length === 0) {
    //         reject();
    //       } else {
    //         let sorted = lastObservations.sort((x, y) => {
    //           return new Date(x.get('phenomenonTime')) - new Date(y.get('phenomenonTime'));
    //         });

    //         resolve(sorted[sorted.length - 1]);
    //       }
    //     });
    //   });
    // });
    
    // return DS.PromiseObject.create({
    //   promise: p
    // });
  }),

  /*
    Shortcut property for the primary datastreams
  */
 
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
