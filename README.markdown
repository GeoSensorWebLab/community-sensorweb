# Arctic Sensor Web Community Data Portal

This repository contains the web front-end for viewing data stored in Arctic Sensor Web's [OGC SensorThings API][] server. This allows visualization and browsing of weather and other research sensor data on a map interface.

Arctic Sensor Web is a part of the [Arctic Connect][] platform.

[Arctic Connect]: http://arcticconnect.org
[OGC SensorThings API]: http://docs.opengeospatial.org/is/15-078r6/15-078r6.html

## Accesssing the Site

The site will be deployed to a public URL and can be viewed by anyone for free. The URL will be added here when the site is online.

### What makes this different than the other Arctic Sensor Web Portal?

TODO: Compare to [other portal][http://sensorthings.arcticconnect.org/#/home], when to use that one and when to use this one

## Deploying this Site

TODO: Write instructions for setting up this web front-end on a new server.

## Development Instructions

When developing the site locally, it is necessary to access the site over HTTP and not via the files directly. This is because the tiles for Arctic Web Map are loaded relatively, and will not load from your file system. An optional Node web server is included to test changes locally.

To start the Node web server, you will need Node.js. Once installed, the server files can be installed with:

```sh
$ npm install
```

And the web server started with:

```sh
$ node index.js
```

Use `Control-C` to quit the web server. The server will then be accessible at http://localhost:3000/.

## Authors

James Badger (<james@jamesbadger.ca>)

## License

GNU General Public License version 3
