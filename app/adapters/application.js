import config from '../config/environment';
import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  host: config.APP.staURL,
  namespace: config.APP.staPath,
  defaultSerializer: 'entity',

  buildURL: function(modelName, id, snapshot, requestType, query) {
    var url = [];
    var host = this.get('host');
    var prefix = this.urlPrefix();
    var path;

    if (modelName) {
      path = this.pathForModelName(modelName);
      if (path) { url.push(path); }
    }

    if (prefix) { url.unshift(prefix); }

    url = url.join('/');
    if (!host && url && url.charAt(0) !== '/') {
      url = '/' + url;
    }

    if (id) {
      var encoded = encodeURIComponent(id);
      url += `(${encoded})`;
    }

    return url;
  },

  // Override findAll to return an array of responses instead of a 
  // single response. This handles server-side pagination, but requires
  // the serializer to parse an array of responses.
  findAll(store, type, sinceToken, snapshotRecordArray) {
    let url = this.buildURL(type.modelName, null, snapshotRecordArray, 'findAll');
    return this.getNextPage(url);
  },

  findHasMany(store, snapshot, url, relationship) {
    console.log("ADAPTER findHasMany")
    return this._super(...arguments);
  },

  // Continuously follow nextLink, and pushing resolved data onto an
  // array
  getNextPage(url) {
    return this.ajax(url, 'GET').then((data) => {
      if (data['@iot.nextLink']) {
        return this.getNextPage(data['@iot.nextLink']).then((moreDataArray) => {
          return [data].concat(moreDataArray);
        });
      } else {
        return [data];
      }
    });
  },

  // Override how model names are translated to URL Entity Paths
  pathForModelName: function(type) {
    switch(type) {
      case "datastream":
      return "Datastreams";
      case "location":
      return "Locations";
      case "observation":
      return "Observations";
      case "observed-property":
      return "ObservedProperties";
      case "sensor":
      return "Sensors";
      case "thing":
      return "Things";
      default:
      console.warn("Unknown path: " + type);
      return null;
    }
  }
});
