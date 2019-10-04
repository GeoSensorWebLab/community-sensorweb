import config from '../config/environment';
import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  host: config.APP.staURL,
  namespace: config.APP.staPath,
  defaultSerializer: 'entity',

  /**
    Builds a URL for a given type and optional ID.

    By default, it pluralizes the type's name according to SensorThings
    API rules, as defined in 
    [pathForModelName](#method_pathForModelName).

    If an ID is specified, it adds the ID to the path generated
    for the type.

    When called by RESTAdapter.findMany() the `id` and `snapshot` 
    parameters will be arrays of ids and snapshots.

    Note: The `query` option is currently discarded.

    @method buildURL
    @param {String} modelName
    @param {(String|Array|Object)} id single id or array of ids or query
    @param {(DS.Snapshot|Array)} snapshot single snapshot or array of snapshots
    @param {String} requestType
    @param {Object} query object of query parameters to send for query requests.
    @return {String} url
  */
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

      if (query && query.relationship) {
        path = this.pathForModelName(query.relationship);
        url += `/${path}`;
      }
    }

    return url;
  },

   /**
    Called by the store in order to fetch an array of responses for all
    of the records for a given type.

    The `findAll` method makes recursive Ajax (HTTP GET) requests to a 
    URL computed by `buildURL`, and returns a promise for the resulting 
    payload. It follows the SensorThings API `@iot.nextLink` to retrieve
    all records.

    Note: This will retrieve **ALL** records without any limit, so it 
    will not stop for very large server-side collections!

    @method findAll
    @param {DS.Store} store
    @param {DS.Model} type
    @param {String} sinceToken
    @param {DS.SnapshotRecordArray} snapshotRecordArray
    @return {Promise} promise
  */
  findAll(store, type, sinceToken, snapshotRecordArray) {
    let url = this.buildURL(type.modelName, null, snapshotRecordArray, 'findAll');
    return this.getNextPage(url);
  },

  /**
    Called by the store in order to fetch a JSON array for
    the unloaded records in a has-many relationship that were originally
    specified as a URL (inside of `links`).

    The `findHasMany` method will make recursive Ajax (HTTP GET) 
    requests to the originally specified URL and any further nextLink.

    On the DS.Model relationship, a custom options object can contain
    the `limit` property which will set a minimum limit on the number
    of records to return, if that many records are available on the
    remote server.

    The format of your `links` value will influence the final request 
    URL via the `urlPrefix` method:

    * Links beginning with `//`, `http://`, `https://`, will be used as 
    is, with no further manipulation.

    * Links beginning with a single `/` will have the current adapter's 
    `host` value prepended to it.

    * Links with no beginning `/` will have a parentURL prepended to it, 
    via the current adapter's `buildURL`.

    @method findHasMany
    @param {DS.Store} store
    @param {DS.Snapshot} snapshot
    @param {String} url
    @param {Object} relationship meta object describing the relationship
    @return {Promise} promise
  */
  findHasMany(store, snapshot, url, relationship) {
    let id = snapshot.id;
    let type = snapshot.modelName;
    let query = relationship.options;

    url = this.urlPrefix(url, this.buildURL(type, id, snapshot, 'findHasMany'));

    let options = {
      $top: relationship.options['$top']
    };

    if (options['$top'] === undefined) {
      options['$top'] = 50;
    }

    return this.getNextPage(url, options, options['$top']);
  },

  /**
    Returns a boolean true/false if the count equals or exceeds the 
    limit. Returns false if either is undefined, in the case where an
    unlimited GET is being performed.

    @method atResultsLimit
    @private
    @param {Integer} count
    @param {Integer} limit
    @return {Boolean} boolean
  */
  atResultsLimit(count, limit) {
    if (count === undefined || limit === undefined || limit === 0) {
      return false;
    } else {
      return (count >= limit);
    }
  },

  /**
    Performs an AJAX GET request for `url`. If the URL has an 
    `@iot.nextLink` and a record limit has not been exceeded, then the
    function calls itself on the next link and concatenates the array
    of responses.

    Return an *array* of SensorThings API responses, which requires a
    custom normalizer in the serializer.

    @method getNextPage
    @private
    @param {String} url
    @param {Object} options
    @param {Integer} limit
    @param {Integer} total
    @return {Promise} promise
  */
  getNextPage(url, options, limit = 0, total = 0) {
    if (options === undefined) {
      options = {};
    }

    return this.ajax(url, 'GET', { data: options }).then((data) => {
      total = total + data.value.length;

      if (data['@iot.nextLink'] && !this.atResultsLimit(total, limit)) {
        return this.getNextPage(data['@iot.nextLink'], {}, limit, total).then((moreDataArray) => {
          return [data].concat(moreDataArray);
        });
      } else {
        return [data];
      }
    });
  },

  /**
    Specify a custom mapping of Ember Data model names to SensorThings
    API entity path names.

    @method pathForModelName
    @private
    @param {String} type
    @return {String} path
  */
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
    let url;

    // If the parent relationship is specified, we flip the URL around
    // and build out a sub-collection query. We have to flip it like 
    // this for the store to properly choose the original model for
    // deserialization.
    if (query && query.parent) {
      query.relationship = type.modelName;
      url = this.buildURL(query.parent.modelName, query.parent.id, null, 'query', query);
    } else {
      url = this.buildURL(type.modelName, query.id, null, 'query', query);
    }
    
    if (this.sortQueryParams) {
      query = this.sortQueryParams(query);
    }

    return this.getNextPage(url, query, query['$top']);
  },
});
