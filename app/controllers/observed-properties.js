import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  sortedModel: computed('model.[]', function() {
    return this.get('model').sortBy('name');
  })
});
