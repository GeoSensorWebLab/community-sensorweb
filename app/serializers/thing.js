import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  primaryKey: '@iot.id',

  pushPayload(store, payload) {
    store.push({
      data: {
        id: payload['@iot.id'],
        type: 'thing',
        attributes: payload
      }
    });
  }
});
