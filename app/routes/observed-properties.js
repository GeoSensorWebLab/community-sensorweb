import $ from 'jquery';
import Route from '@ember/routing/route';

export default Route.extend({
  getRecursive(url) {
    let model = 'observed-property';
    let store = this.get('store');
    let serializer = store.serializerFor(model);

    $.getJSON(url, (payload) => {
      let normalizedPayload = serializer.normalizeResponse(store, store.modelFor(model), payload, null, 'findAll', false);
      store.push(normalizedPayload);

      if (normalizedPayload.links && normalizedPayload.links.next) {
        this.getRecursive(normalizedPayload.links.next);
      }
    });
  },

  model() {
    let model = 'observed-property';
    let store = this.get('store');
    let adapter = store.adapterFor(model);
    let serializer = store.serializerFor(model);
    let baseCollectionURL = adapter.buildURL('observed-property');

    this.getRecursive(baseCollectionURL);

    return store.peekAll(model);
  }
});
