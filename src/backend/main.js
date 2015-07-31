var ipc = require("ipc");
var Beef = require("./Beef");

var flux = new Beef([
  require("./stores/TodoStore")
]);

var clientWindows = [];

ipc.on('flux-action', function(event) {
  console.log("[ipc] flux-action");
  var args = Array.prototype.slice.call(arguments, 1);
  flux.action.apply(flux, args);
  if (clientWindows.indexOf(event.sender) === -1) {
    clientWindows.push(event.sender);
  }
});

flux.on('change', function(store, state) {
  console.log('[flux] change', store, state);
  process.nextTick(function() {
    for (var i = 0; i < clientWindows.length; i++) {
      clientWindows[i].send('flux-change', store, state);
    }
  });
});

module.exports = flux;
