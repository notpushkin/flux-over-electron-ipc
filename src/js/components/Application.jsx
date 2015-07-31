var ipc = require('ipc');
var React = require("react");

var TodoItem = React.createClass({
  propTypes: {
    todo: React.PropTypes.object.isRequired
  },

  render: function() {
    var style = {
      textDecoration: this.props.todo.complete ? "line-through" : ""
    };

    return <span style={style} onClick={this.onClick}>{this.props.todo.text}</span>;
  },

  onClick: function() {
    ipc.send('flux-action', 'TOGGLE_TODO', this.props.todo.id);
  }
});


var Application = React.createClass({
  componentWillMount: function() {
    var self = this;
    this.props.TodoStore.on('change', function(todos) {
      console.log("[Application] TodoStore:change", todos);
      self.setState({ todos: todos });
    })
  },

  getInitialState: function() {
    return {
      newTodoText: "",
      todos: {}
    };
  },

  render: function() {
    var todos = this.state.todos;
    return (
      <div>
        <ul>
          {Object.keys(todos).map(function(id) {
            return <li key={id}><TodoItem todo={todos[id]} /></li>;
          })}
        </ul>
        <form onSubmit={this.onSubmitForm}>
          <input type="text" size="30" placeholder="New Todo"
                 value={this.state.newTodoText}
                 onChange={this.handleTodoTextChange} />
          <input type="submit" value="Add Todo" />
        </form>
        <button onClick={this.clearCompletedTodos}>Clear Completed</button>
      </div>
    );
  },

  handleTodoTextChange: function(e) {
    this.setState({ newTodoText: e.target.value });
  },

  onSubmitForm: function(e) {
    e.preventDefault();
    if (this.state.newTodoText.trim()) {
      ipc.send('flux-action', 'ADD_TODO', this.state.newTodoText);
      this.setState({ newTodoText: "" });
    }
  },

  clearCompletedTodos: function(e) {
    ipc.send('flux-action', 'CLEAR_TODOS');
  }
});

module.exports = Application;
