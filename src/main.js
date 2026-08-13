import { createTodo, toggle, remove } from "./todo.js";
import { loadTodos, saveTodos } from "./storage.js";
import { renderTodos, updateStatus } from "./ui.js";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const listElement = document.getElementById("todo-list");
const statusElement = document.getElementById("task-status");

let todos = loadTodos();

function updateUI() {
  renderTodos(todos, listElement, handleToggle, handleDelete);
  updateStatus(todos, statusElement);
  saveTodos(todos);
}

function handleToggle(id) {
  todos = todos.map(todo => (todo.id === id ? toggle(todo) : todo));
  updateUI();
}

function handleDelete(id) {
  todos = remove(todos, id);
  updateUI();
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const text = input.value.trim();

  if (!text) {
    input.focus();
    return;
  }

  todos = [...todos, createTodo(text)];
  input.value = "";
  updateUI();
  input.focus();
});

updateUI();
