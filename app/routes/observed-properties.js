import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    let model = 'observed-property';
    let store = this.get('store');
    return store.findAll(model);
  }
});
