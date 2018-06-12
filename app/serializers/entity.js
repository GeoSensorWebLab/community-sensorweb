import { assert, warn } from '@ember/debug';
import DS from 'ember-data';

export default DS.JSONSerializer.extend({
  primaryKey: '@iot.id',

  /**
    Extract any SensorThings API links from the payload into a JSON-API
    compatible links object.
    
    @method extractLinks
    @param {Object} payload
    @return {Object} links
  */
  extractLinks(payload) {
    if (payload['@iot.nextLink']) {
      return {
        next: payload['@iot.nextLink']
      };
    }
  },

  /**
    `extractMeta` is used to deserialize any meta information in the
    adapter payload. By default Ember Data expects meta information to
    be located on the `meta` property of the payload object.
    
    This method has been overridden for SensorThings API. 

    @method extractMeta
    @param {DS.Store} store
    @param {DS.Model} modelClass
    @param {Object} payload
  */
  extractMeta(store, typeClass, payload) {
    if (payload && payload['@iot.count'] !== undefined) {
      return { count: payload['@iot.count'] };
    }
  },

  /**
    Returns a relationship formatted as a JSON-API "relationship 
    object".

    http://jsonapi.org/format/#document-resource-object-relationships

    This method has been overridden for SensorThings API.

    @method extractRelationship
    @param {Object} relationshipModelName
    @param {Object} relationshipHash
    @return {Object}
  */
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

  /**
   `keyForLink` can be used to define a custom key when deserializing 
   link properties.

   This method has been overridden for SensorThings API.

   @method keyForLink
   @param {String} key
   @param {String} kind `belongsTo` or `hasMany`
   @return {String} normalized key
  */
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

   /**
    In SensorThings API, a request may be paginated server-side. The 
    Ember Adapter is set up to retrieve the pages recursively up to an
    optionally specified limit, and return an array of responses to the
    Ember Store, which passes that to here as the payload.

    An array of responses must be reduced to a single payload object
    that can be normalized using the generic normalizer.

    This method has been overridden for SensorThings API.

    @method normalizeArrayResponse
    @param {DS.Store} store
    @param {DS.Model} primaryModelClass
    @param {Object} payload
    @param {String|Number} id
    @param {String} requestType
    @return {Object} JSON-API Document
  */
  normalizeArrayResponse(store, primaryModelClass, payload, id, requestType) {
    return payload.reduce((newPayload, aPayload) => {
      let normalized = this.normalizeResponseGeneric(store, primaryModelClass, aPayload, id, requestType, false);
      newPayload.data = newPayload.data.concat(normalized.data);
      return newPayload;
    }, {
      data: []
    });
  },

  /**
    The `normalizeResponse` method is used to normalize a payload from the
    server to a JSON-API Document.

    http://jsonapi.org/format/#document-structure

    This method delegates to a more specific normalize method based on
    the `requestType`.

    This method has been overridden for SensorThings API.

    @method normalizeResponse
    @param {DS.Store} store
    @param {DS.Model} primaryModelClass
    @param {Object} payload
    @param {String|Number} id
    @param {String} requestType
    @return {Object} JSON-API Document
  */
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
        return this.normalizeQueryResponse(...arguments);
      case 'createRecord':
        return this.normalizeResponseGeneric(...arguments);
      case 'deleteRecord':
        return this.normalizeResponseGeneric(...arguments);
      case 'updateRecord':
        return this.normalizeResponseGeneric(...arguments);
    }
  },

  /**
    Normalize a findAll response. As this is a SensorThings API entity
    collection, it is an array of one or more responses.

    This method has been overridden for SensorThings API.

    @method normalizeQueryResponse
    @param {DS.Store} store
    @param {DS.Model} primaryModelClass
    @param {Object} payload
    @param {String|Number} id
    @param {String} requestType
    @return {Object} JSON-API Document
  */
  normalizeFindAllResponse(store, primaryModelClass, payload, id, requestType) {
    return this.normalizeArrayResponse(...arguments);
  },

  /**
    Normalize a query response. As this is a SensorThings API entity
    collection, it is an array of one or more responses.

    This method has been overridden for SensorThings API.

    @method normalizeQueryResponse
    @param {DS.Store} store
    @param {DS.Model} primaryModelClass
    @param {Object} payload
    @param {String|Number} id
    @param {String} requestType
    @return {Object} JSON-API Document
  */
  normalizeQueryResponse(store, primaryModelClass, payload, id, requestType) {
    return this.normalizeArrayResponse(...arguments);
  },

   /*
    Method based on DS.RestSerializer's generic response normalizer.

    This method has been re-defined for SensorThings API.

    @method normalizeResponseGeneric
    @private
    @param {DS.Store} store
    @param {DS.Model} primaryModelClass
    @param {Object} payload
    @param {String|Number} id
    @param {String} requestType
    @param {Boolean} isSingle
    @return {Object} JSON-API Document
  */
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
