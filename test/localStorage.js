if (typeof localStorage === 'undefined') {
  global.localStorage = {
    storage: {},
    setItem: function(key, value) {
      this.storage[key] = value;
    },
    getItem: function(key) {
      return this.storage[key];
    }
  }
}

export default localStorage;