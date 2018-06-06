import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  normalize(typeClass, hash) {
    let newHash = {
      data: {
        id: hash['@iot.id'],
        type: 'thing',
        attributes: hash,
        relationships: {
          locations: {
            links: {
              related: hash['Locations@iot.navigationLink']
            }
          },
          datastreams: {
            links: {
              related: hash['Datastreams@iot.navigationLink']
            }
          },
          historicalLocations: {
            links: {
              related: hash['HistoricalLocations@iot.navigationLink']
            }
          }
        }
      }
    };

    return newHash;
  }
});
