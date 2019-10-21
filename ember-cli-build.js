'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    // Add options here
    fingerprint: {
      exclude: [
      ]
    }
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.
  app.import('node_modules/highcharts/highcharts.src.js', {
    using: [
      { transformation: 'cjs', as: 'highcharts' }
    ]
  });
  app.import('node_modules/highcharts/modules/accessibility.js', {
    using: [
      { transformation: 'cjs', as: 'highcharts-accessibility' }
    ]
  });
  app.import('node_modules/highcharts/modules/no-data-to-display.js', {
    using: [
      { transformation: 'cjs', as: 'no-data-to-display' }
    ]
  });
  app.import('node_modules/highcharts/highstock.src.js', {
    using: [
      { transformation: 'cjs', as: 'highcharts/highstock' }
    ]
  });

  app.import('node_modules/ol/ol.css');

  return app.toTree();
};
