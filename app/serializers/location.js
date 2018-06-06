import DS from 'ember-data';

export default DS.JSONSerializer.extend({
  primaryKey: '@iot.id',

  // Customize method to handle payload.value array
  normalizeResponse(store, primaryModelClass, payload, id, requestType, isSingle) {
    let documentHash = {
      data: null
    };

    let meta = this.extractMeta(store, primaryModelClass, payload);
    if (meta) {
      assert(
        'The `meta` returned from `extractMeta` has to be an object, not "' + typeOf(meta) + '".',
        typeOf(meta) === 'object'
      );
      documentHash.meta = meta;
    }

    if (isSingle) {
      let { data } = this.normalize(primaryModelClass, payload);
      documentHash.data = data;
    } else {
      let ret = new Array(payload.value.length);
      for (let i = 0, l = payload.value.length; i < l; i++) {
        let item = payload.value[i];
        let { data } = this.normalize(primaryModelClass, item);
        ret[i] = data;
      }

      documentHash.data = ret;
    }

    return documentHash;
  }
});
