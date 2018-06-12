# Arctic Sensor Web Community Data Portal

This repository contains the web front-end for viewing data stored in Arctic Sensor Web's [OGC SensorThings API][] server. This allows visualization and browsing of weather and other research sensor data on a map interface.

Arctic Sensor Web is a part of the [Arctic Connect][] platform.

[Arctic Connect]: http://arcticconnect.org
[OGC SensorThings API]: http://docs.opengeospatial.org/is/15-078r6/15-078r6.html

## Accesssing the Site

The site will be deployed to a public URL and can be viewed by anyone for free. The URL will be added here when the site is online.

Special Pages:

`/observed-properties` - Will retrieve ALL the Observed Properties from the SensorThings API backend, using pagination links to download all records. If there are a lot of records this could take awhile.

### What makes this different than the other Arctic Sensor Web Portal?

TODO: Compare to [other portal][http://sensorthings.arcticconnect.org/#/home], when to use that one and when to use this one

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Ember CLI](https://ember-cli.com/)
* [Google Chrome](https://google.com/chrome/)

## Installation

* `git clone <repository-url>` this repository
* `cd arctic-community-sensor-web`
* `npm install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

* [ember.js](https://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

## Authors

James Badger (<james@jamesbadger.ca>)

## License

GNU General Public License version 3
