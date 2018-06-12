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

  atResultsLimit(count, limit) {
    if (count === undefined || limit === undefined) {
      return false;
    } else {
      return (count >= limit);
    }
  },

  // Continuously follow nextLink, and pushing resolved data onto an
  // array
  getNextPage(url, options) {
    if (options.total === undefined) {
      options.total = 0;
    }

    return this.ajax(url, 'GET').then((data) => {
      options.total = options.total + data.value.length;

      if (data['@iot.nextLink'] && !this.atResultsLimit(options.total, options.limit)) {
        return this.getNextPage(data['@iot.nextLink'], options).then((moreDataArray) => {
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
  },

  /**
    Called by the store in order to fetch a JSON array for
    the records that match a particular query.

    The `query` method makes an Ajax (HTTP GET) request to a URL
    computed by `buildURL`, and returns a promise for the resulting
    payload. The resulting payload is an array of responses that must
    be properly normalized by the serializer.

    The `query` argument is a simple JavaScript object that contains one
    used property: `limit` that defines how many records to retrieve
    from the remote service. The server *may* return more records than 
    the limit due to pagination.

    @method query
    @param {DS.Store} store
    @param {DS.Model} type
    @param {Object} query
    @return {Promise} promise
  */
  query(store, type, query) {
    let url = this.buildURL(type.modelName, null, null, 'query', query);
    
    if (this.sortQueryParams) {
      query = this.sortQueryParams(query);
    }

    return this.getNextPage(url, query);
  },
});
