import DS from 'ember-data';

export default DS.JSONSerializer.extend({
  primaryKey: '@iot.id',

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
    let properKey = '';
    switch(key) {
      case 'things':
      properKey = 'Things';
      break;
      case 'locations':
      properKey = 'Locations';
      break;
      case 'historicalLocations':
      properKey = 'HistoricalLocations';
      break;
      case 'datastreams':
      properKey = 'Datastreams';
      break;
      default:
      console.warn('Unhandled keyForLink', key);
    }

    return `${properKey}@iot.navigationLink`;
  },

  // Customize method to handle payload.value array
  normalizeResponse(store, primaryModelClass, payload, id, requestType, isSingle) {
    let documentHash = {
      data: null
    };

    let meta = this.extractMeta(store, primaryModelClass, payload);
    if (meta) {
      assert(
        'The `meta` returned from `extractMeta` has to be an object, not "' + typeOf(meta) + '".',
        typeOf(meta) === 'object'
      );
      documentHash.meta = meta;
    }

    if (isSingle) {
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
