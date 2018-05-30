import Component from '@ember/component';
import Highcharts from 'highcharts';

export default Component.extend({
  didInsertElement() {
    this._super(...arguments);
    let chart = Highcharts.chart('chart', {
      rangeSelector: {
        enabled: false
      },

      title: {
        text: "Howdy"
      },

      series: [{
        name: "asdf",
        data: [1,2,3,4],
        pointStart: Date.UTC(2018, 4, 14, 22),
        pointInterval: 3600 * 1000,
        tooltip: {
          valueDecimals: 1,
          valueSuffix: "C"
        }
      }]
    });

    this.set('chart', chart);
  }
});
