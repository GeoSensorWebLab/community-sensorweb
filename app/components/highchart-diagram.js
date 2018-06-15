import Component from '@ember/component';
import Highcharts from 'highcharts';

export default Component.extend({
  datastream: null,

  didInsertElement() {
    this._super(...arguments);
    this.resetChart();
  },

  didUpdateAttrs() {
    this.resetChart();
  },

  /*
    Reset the chart to a basic state and set a handler to download the
    Datastream details, then download the recent observations and add
    them as a series.
  */
  resetChart() {
    if (this.get('chart')) {
      this.get('chart').destroy();
    }

    let chart = Highcharts.chart('chart', {
      rangeSelector: {
        enabled: false
      },

      title: {
        text: "Loading…"
      },

      xAxis: {
        type: 'datetime',
        title: {
          text: 'Date (UTC)'
        }
      }
    });

    this.set('chart', chart);
    this.get('datastream').then((datastream) => {

      // Load datastream and observed-property details into chart
      let propertyName = datastream.get('observedProperty.name');
      let unit = datastream.get('unitOfMeasurement').name;
      let chart = this.get('chart');

      chart.setTitle({ text: datastream.get('name') });
      chart.showLoading();

      chart.yAxis[0].setTitle({
        text: `${propertyName} (${unit})`
      });

      datastream.recentObservations().then((observations) => {
        // Convert Observations to data points
        let seriesData = observations.map((observation) => {
          let timestamp = new Date(observation.get('phenomenonTime'));
          let value = parseFloat(observation.get('result'));
          return [+timestamp, value];
        });

        // Ensure data is sorted by date ascending
        seriesData = seriesData.sort((x, y) => {
          return x[0] - y[0];
        });

        chart.addSeries({
          name: propertyName,
          data: seriesData,
          tooltip: {
            valueSuffix: unit
          }
        });
      });
    });
  },

  willDestroyElement() {
    let chart = this.get('chart');

    if (chart) {
      chart.destroy();
    }
  }
});
