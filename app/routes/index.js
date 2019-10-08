import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    let store = this.get('store');
    return store.query('Thing', {
      $expand: 'Locations'
    });
  }
});
