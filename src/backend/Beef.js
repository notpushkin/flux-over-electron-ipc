var EventEmitter = require("events").EventEmitter;

/** Bee Flux */
class Beef extends EventEmitter {
  constructor(stores) {
    super();
    var self = this;

    this.stores = [];
    for (var i = 0; i < stores.length; i++) {
      this.stores[i] = new (stores[i])(this);
      this.stores[i].on('change', function() {
        self.emit('change', this.constructor.name, this.getState());
      })
    }
  }

  action(name) {
    this.emit.apply(this, arguments);
  }
}

module.exports = Beef;
