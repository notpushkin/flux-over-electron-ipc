var EventEmitter = require("events").EventEmitter;

class TodoStore extends EventEmitter {
  constructor(flux) {
    super();
    flux.on('ADD_TODO', this.addTodo.bind(this));
    flux.on('TOGGLE_TODO', this.toggleTodo.bind(this));
    flux.on('CLEAR_TODOS', this.clearTodos.bind(this));

    this.todoId = 0;
    this.todos = {};
  }

  getState() {
    return this.todos;
  }

  addTodo(text) {
    var todo = {
      id: ++this.todoId,
      text: text,
      complete: false
    };
    this.todos[todo.id] = todo;
    this.emit('change');
  }

  toggleTodo(id) {
    this.todos[id].complete = !this.todos[id].complete;
    this.emit('change');
  }

  clearTodos() {
    this.todos = {};
    this.emit('change');
  }
}

module.exports = TodoStore;
