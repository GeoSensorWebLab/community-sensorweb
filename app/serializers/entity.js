import DS from 'ember-data';
import { isNone, typeOf } from '@ember/utils';

export default DS.JSONAPISerializer.extend({
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

    // If payload is an array, parse each set of responses one at a time
    if (typeOf(payload) !== "array") {
      console.error("Unhandled payload type")
    } else {
      // Initialize empty array instead of null value
      documentHash.data = [];

      payload.forEach((response) => {
        // TODO: Extract meta information such as the collection size
        // from the STA response

        // If the response is a single entity
        if (typeOf(response.value) !== "array") {

        } else {
          // If the response is a collection of entities
          let entities = response.value;

          entities.forEach((entity) => {
            // Convert entity for JSON:API `data` array
            // TODO: Extract entities retrieved with $expand to the 
            //       JSON:API `included` array
            
            let dataEntity = {
              id: entity["@iot.id"],
              type: primaryModelClass.modelName,
              attributes: entity,
              relationships: {},
              links: {}
            };

            // Remove links from attributes
            Object.keys(dataEntity.attributes).forEach((key) => {
              let value = dataEntity.attributes[key];

              // For links to related entities
              if (key.includes("@iot.navigationLink")) {
                // Get the name of the relationship from the key.
                // TODO: Find the correct case and pluralization for
                // mapping between STA and JSON:API and Ember Data
                let relationshipName = key.split("@")[0];

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

            // Remove id from attributes
            delete dataEntity.attributes["@iot.id"];

            documentHash.data.push(dataEntity);
          });
        }
      });
    }

    return documentHash;
  },
});
