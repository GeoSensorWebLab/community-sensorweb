import { assert, warn } from '@ember/debug';
import DS from 'ember-data';

export default DS.JSONSerializer.extend({
  primaryKey: '@iot.id',

  // If the payload contains any top-level pagination links, then 
  // extract them to a JSON API compatible `links` object
  extractLinks(payload) {
    if (payload['@iot.nextLink']) {
      return {
        next: payload['@iot.nextLink']
      };
    }
  },

  extractMeta(store, typeClass, payload) {
    if (payload && payload['@iot.count'] !== undefined) {
      return { count: payload['@iot.count'] };
    }
  },

  // Override to only extract navigation links from SensorThings API
  // Expanded records not supported yet.
  extractRelationships(modelClass, resourceHash) {
    let relationships = {};

    modelClass.eachRelationship((key, relationshipMeta) => {
      let relationship = null;

      let linkKey = this.keyForLink(key, relationshipMeta.kind);
      if (resourceHash[linkKey] !== undefined) {
        let related = resourceHash[linkKey];
        relationship = relationship || {};
        relationship.links = { related };
      }

      if (relationship) {
        relationships[key] = relationship;
      }
    });

    return relationships;
  },

  keyForLink(key, kind) {
    const keys = {
      'datastream':       'Datastream',
      'datastreams':      'Datastreams',
      'locations':        'Locations',
      'observations':     'Observations',
      'observedProperty': 'ObservedProperty',
      'thing':            'Thing',
      'things':           'Things'
    }

    let properKey = keys[key];
    if (properKey === undefined) {
      console.warn('Unhandled keyForLink', key);
    }

    return `${properKey}@iot.navigationLink`;
  },

  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    switch (requestType) {
      case 'findRecord':
        return this.normalizeResponseGeneric(...arguments);
      case 'queryRecord':
        return this.normalizeResponseGeneric(...arguments);
      case 'findAll':
        return this.normalizeFindAllResponse(...arguments);
      case 'findBelongsTo':
        return this.normalizeResponseGeneric(...arguments);
      case 'findHasMany':
        return this.normalizeResponseGeneric(...arguments);
      case 'findMany':
        return this.normalizeResponseGeneric(...arguments);
      case 'query':
        return this.normalizeResponseGeneric(...arguments);
      case 'createRecord':
        return this.normalizeResponseGeneric(...arguments);
      case 'deleteRecord':
        return this.normalizeResponseGeneric(...arguments);
      case 'updateRecord':
        return this.normalizeResponseGeneric(...arguments);
    }
  },

  // To handle server-side pagination, we have the adapter do a series 
  // of GET requests and resolve the promise to the store with an array 
  // of responses. Each of those array items is normalized here.
  normalizeFindAllResponse(store, primaryModelClass, payload, id, requestType) {
    return payload.reduce((newPayload, aPayload) => {
      let normalized = this.normalizeResponseGeneric(store, primaryModelClass, aPayload, id, requestType, false);
      newPayload.data = newPayload.data.concat(normalized.data);
      return newPayload;
    }, {
      data: []
    });
  },

  // Customize method to handle payload.value array
  normalizeResponseGeneric(store, primaryModelClass, payload, id, requestType, isSingle) {
    let documentHash = {
      data: null
    };

    let meta = this.extractMeta(store, primaryModelClass, payload);
    if (meta) {
      assert(
        'The `meta` returned from `extractMeta` has to be an object, not "' + typeof(meta) + '".',
        typeof(meta) === 'object'
      );
      documentHash.meta = meta;
    }

    let links = this.extractLinks(payload);
    if (links) {
      assert(
        'The `links` returned from `extractLinks` has to be an object, not "' + typeof(links) + '".',
        typeof(links) === 'object'
      );
      documentHash.links = links;
    }

    if (isSingle || requestType === "findBelongsTo") {
      let { data } = this.normalize(primaryModelClass, payload);
      documentHash.data = data;
    } else {
      let ret = new Array(payload.value.length);
      for (let i = 0, l = payload.value.length; i < l; i++) {
        let item = payload.value[i];
        let { data } = this.normalize(primaryModelClass, item);
        ret[i] = data;
      }

      documentHash.data = ret;
    }

    return documentHash;
  }
});
