# SensorThings API Adapter for Ember

Some notes about the partial implementation of an [Ember Data][] adapter that can connect to the Open Geospatial Consortium's [SensorThings API](STA). I hope to extract the code from this project into its own [Ember CLI Add-on][add-on].

[add-on]: https://ember-cli.com/extending/#developing-addons-and-blueprints
[Ember Data]: https://github.com/emberjs/data
[STA]: http://docs.opengeospatial.org/is/15-078r6/15-078r6.html

## About Ember Data and OData-like APIs

Ember Data has adapters for connecting to APIs that use JSON:API, generic JSON, and REST style. Each of these can be extended to work with SensorThings API; the choice boils down to which one you want to write a deserializer from SensorThings API to the schema that the Serializer class wants. I found it simpler to base the Serializer on JSON:API, as that schema has a very similar level of flexibility to SensorThings API.

For example, STA's [`$expand`][expand] function is very similiar to JSON:API's [compound documents][], so the Serializer needs to move embedded entities into the `included` array.

[compound documents]: http://jsonapi.org/format/#document-compound-documents
[expand]: http://docs.opengeospatial.org/is/15-078r6/15-078r6.html#47

## About Server-side Pagination

From what I can tell, server-side pagination is not automatically handled in Ember Data. Instead the developer must use any pagination links in the server response `links` object to request more data, typically in an Ember Controller or Component. I ran into an issue where a `Thing` has more than 20 `Datastreams`, and the SensorThings API implementation I am using only shows 20 per page<sup>1</sup>. So a station will not display it's air temperature if the first 20 `Datastreams` don't include the one for air temperature.

To solve this I added some overrides to the Ember Adapter that automatically retrieve additional pages from SensorThings API, unless a limit is specified. (This limit option is separate from the SensorThings API `$top` operator.) So when a developer asks an Ember Store for **ALL** the records, then that is what you will get.

```javascript
// In a route
this.get('store').findAll('observed-property');

```

Notice that no limit is specified on `findAll`, as no custom options can be specified on `findAll` that will be passed to the `Adapter`: so be careful when requesting something that may have hundreds, thousands, or more items!

A safer alternative is to use `query`.

```javascript
// In a route
this.get('store').query('observed-property', {
	$top: 50
});
```

This will attempt to retrieve *at least* 50 Observed Properties from the server. If there are less than 50 on the server, then that many will be returned: because there was no additional `@iot.nextLink` in the server response, the `Adapter` stopped its recursive `GET` queries.

If the server pagination default is 20, for example, then 60 entities will be returned to Ember even though only 50 were specified. I *may* change this behaviour in the future to set a hard limit by integrating `$top`.

**\[1\]** Note: this no longer applies in 2019 as I switched implementations for STA. Using `$top` to limit a query still works.

## SensorThings API Query Functions

Currently supported:

* `$count`
* `$expand`
* `$filter`
* `$orderby`
* `$skip`
* `$top`


```javascript
// In a route, or model
let oneDayAgo = new Date(new Date() - 86400 * 1000);
this.get('store').query('observation', {
	$top: 50,
	$orderby: 'phenomenonTime desc',
	$filter: 'phenomenonTime ge ' + oneDayAgo.toISOString()
});
```

This will make a request on the SensorThings URL:

```
http://sensorthings.example.com/v1.0/Observations?$orderby=phenomenonTime%20desc&$filter=phenomenonTime%20ge%202018-06-14T20:31:11.919Z&$top=50
```

### Entity Relationship Collections

For querying all the `Observations` under a `Datastream`:

```javascript
this.get('store').query('observation', {
      parent: {
        id: datastream.get('id'),
        modelName: 'datastream'
      },
      $top: 50,
      $orderby: 'phenomenonTime desc'
    });
```

This will make a request on the SensorThings URL:

```
http://sensorthings.example.com/v1.0/Datastreams(id)/Observations?$orderby=phenomenonTime%20desc&$top=50
```

The "parent" entity must be passed in as a property because the Ember Data Store must be told what type of model is being deserialized *first* (in this example, `observation`). If `parent` is omitted, then a simple query will be performed.

## SensorThings API MQTT

I have built [a demo app][sta-webcam] that can connect to a SensorThings API MQTT service and automatically download `Observations` when they are published. In it's [index route][] I connect to MQTT and wait for updates, filter them by datastreams we are interested in, then deserialize and add to the Ember Store. That app is Ember 2.3 so some things may have to be changed for Ember 3+.

If I want to add live updates to this app (Community Sensor Web), then I will have to integrate MQTT.

[index route]: https://github.com/GeoSensorWebLab/sta-webcam/blob/master/app/routes/index.js
[sta-webcam]: https://github.com/GeoSensorWebLab/sta-webcam
