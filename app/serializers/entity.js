import DS from 'ember-data';
import { camelize, capitalize } from '@ember/string';
import { isNone, typeOf } from '@ember/utils';

export default DS.JSONAPISerializer.extend({
  /**
    Convert a JSON:API data array of resources to a JSON:API 
    relationship data array of resources (id and type only).

    @method extractRelationshipData
    @param {Array} dataArray: JSON:API Data Array
    @return {Array} Relationship Data Array
  */
  extractRelationshipData(dataArray) {
    return dataArray.map((entity) => {
      return {
        id:   entity.id,
        type: entity.type
      };
    });
  },

  /**
   `keyForRelationship` maps names of relations between entities from
   SensorThings API (PascalCase) to Ember Data (camelCase).

   The `Ember.String` class is used to do this transformation.

   https://api.emberjs.com/ember/3.1/classes/String
   
   @method keyForRelationship
   @param {String} key
   @param {String} typeClass
   @param {String} method
   @return {String} normalized key
  */
  keyForRelationship(key, typeClass, method) {
    return camelize(key);
  },

  /**
    The `normalizeResponse` method is used to normalize a payload from
    OGC SensorThings API to a JSON:API Document.

    http://jsonapi.org/format/#document-structure
    
    This method delegates to a more specific normalize method based on
    the `requestType`.

    @method normalizeResponse
    @param {DS.Store} store
    @param {DS.Model} primaryModelClass
    @param {Object} payload
    @param {String|Number} id
    @param {String} requestType
    @return {Object} JSON:API Document
  */
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    let documentHash = {
      data: null,
      included: []
    };

    let payloadsToParse = payload;

    // If payload is an array, parse each set of responses one at a time
    if (typeOf(payload) !== "array") {
      payloadsToParse = [payload];
    }

    // Initialize empty array instead of null value
    documentHash.data = [];

    payloadsToParse.forEach((response) => {
      // Extract meta data, if available
      if (response["@iot.count"]) {
        documentHash.meta = {
          total: response["@iot.count"]
        };
      }

      // Extract entities from response and transform to data resources
      // and sideloaded resources
      let entities = response.value;

      // If the response is a single entity, then documentHash.data must
      // be a single object
      if (typeOf(response.value) !== "array") {
        let { data, included } = this.normalizeEntity(store, primaryModelClass, response.value);

        documentHash.data = data;
        documentHash.included.push(...included);
      } else {
        entities.forEach((entity) => {
          // Convert entity for JSON:API `data` array            
          let { data, included } = this.normalizeEntity(store, primaryModelClass, entity);

          documentHash.data.push(...data);
          documentHash.included.push(...included);
        });
      }
    });

    return documentHash;
  },

  /**
    Convert a SensorThings API entity to resources for JSON:API. Will be
    called recursively on any entities embedded using `$expand`.

    The `store` is used to determine the class for a model on an entity.

    The `primaryModelClass` is passed in so we know the Ember Data name 
    of the model type.

    @method normalizeEntity
    @param {DS.Store} store
    @param {DS.Model} primaryModelClass
    @param {Object} entity
    @return {Object} JSON:API Document
  */
  normalizeEntity(store, primaryModelClass, entity) {
    let documentHash = {
      data: [],
      included: []
    };

    let dataEntity = {
      id: entity["@iot.id"],
      type: primaryModelClass.modelName,
      attributes: entity,
      relationships: {},
      links: {}
    };

    // Remove STA `@iot.id` from attributes
    delete dataEntity.attributes["@iot.id"];

    // Remove STA navigation links from attributes and put them in
    // JSON:API links object
    Object.keys(dataEntity.attributes).forEach((key) => {
      let value = dataEntity.attributes[key];

      // For links to related entities
      if (key.includes("@iot.navigationLink")) {
        // Get the name of the relationship from the key.
        let relationshipName = this.keyForRelationship(key.split("@")[0]);

        // We use `related` instead of `self` as it is not a 
        // SensorThings API `@iot.selfLink`.
        dataEntity.relationships[relationshipName] = {
          links: { related: value }
        };
        delete dataEntity.attributes[key];
        
      } else if (key.includes("@iot.selfLink")) {
        // Copy the self link to the links object
        dataEntity.links.self = value;
        delete dataEntity.attributes[key];
      }
    });

    // Move any embedded entities to `included` array
    // and add a `data` object to the relationship
    primaryModelClass.relationshipsByName.forEach((relationship) => {
      let staRelationshipName = capitalize(relationship.key);
      let value = dataEntity.attributes[staRelationshipName];

      if (value !== undefined) {
        // Collect entity or entities for relationship data.
        // For a single entity, relationshipData should be an object;
        // otherwise, an array.
        let relationshipData;

        if (typeOf(value) !== "array") {
          let relatedEntityClass = store.modelFor(relationship.type);
          let { data, included } = this.normalizeEntity(store, relatedEntityClass, value);

          documentHash.included.push(...data);
          documentHash.included.push(...included);

          relationshipData = this.extractRelationshipData(data)[0];
        } else {
          value.forEach((relatedEntity) => {
            let relatedEntityClass = store.modelFor(relationship.type);
            let { data, included } = this.normalizeEntity(store, relatedEntityClass, relatedEntity);

            documentHash.included.push(...data);
            documentHash.included.push(...included);

            relationshipData = this.extractRelationshipData(data);
          });
        }

        // Add a JSON:API relationship data object
        dataEntity.relationships[relationship.key] = {
          data: relationshipData
        };

        // Remove embedded object from data entity attributes
        delete dataEntity.attributes[staRelationshipName];
      }
    });

    documentHash.data.push(dataEntity);

    return documentHash;
  },
});
