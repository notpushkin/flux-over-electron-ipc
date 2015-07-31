var ipc = require("ipc");
var EventEmitter = require('events').EventEmitter;
var React = require("react");
var Application = require("./components/Application");

var stores = {
  TodoStore: new EventEmitter()
}

ipc.on('flux-change', function(store, state) {
  console.log("[ipc-ui] flux-change", store, state);
  if (stores.hasOwnProperty(store)) {
    stores[store].emit('change', state);
  }
});

React.render(<Application TodoStore={stores.TodoStore} />, document.getElementById("appGoesHere"))
