import Component from '@ember/component';
import Highcharts from 'highcharts';
import NoDataToDisplay from 'no-data-to-display';

import { debounce } from '@ember/runloop';

// Enable "No Data" module for Highcharts
NoDataToDisplay(Highcharts);

export default Component.extend({
  datastream: null,

  didInsertElement() {
    this._super(...arguments);
    this.resetChart();

    /*
      When the window is resized, the chart (when it has been rendered)
      must be resized to fit its container. We use a debounce to 
      prevent too many resize calls as the window is resized.
     */
    $(window).on('resize', () => {
      debounce(this, this.resizeChartToContainer, 150);
    });
  },

  didUpdateAttrs() {
    this.resetChart();
  },

  /*
    Set the chart width and height to that of its parent container.
    Highcharts will automatically animate the resize transition.
   */
  resizeChartToContainer() {
    let chart = this.get('chart');
    if (chart) {
      let $parent = this.$().parent();
      chart.setSize($parent.width(), $parent.height());
    }
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
      lang: {
        noData: "No data for past 24 hours"
      },

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

    window.chart = chart;

    this.set('chart', chart);
    this.get('datastream').then((datastream) => {

      // Load datastream and observed-property details into chart
      let propertyName = datastream.get('observedProperty.name');
      let unit = datastream.get('unitOfMeasurement').name;
      let chart = this.get('chart');

      chart.setTitle({ text: datastream.get('name') });
      chart.showLoading();

      datastream.recentObservations().then((observations) => {
        chart.hideLoading();
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

        // Only update the chart if data is available
        if (seriesData.length > 0) {
          // Add property and units to y axis label
          chart.yAxis[0].setTitle({
            text: `${propertyName} (${unit})`
          });

          chart.addSeries({
            name: propertyName,
            data: seriesData,
            tooltip: {
              valueSuffix: unit
            }
          }); 
        }
        
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
