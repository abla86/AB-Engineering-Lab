const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const priorityInput = document.getElementById("priority-input");
const dateInput = document.getElementById("date-input");

const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");

const searchInput = document.getElementById("search-input");
const filters = document.getElementById("filters");

const totalCount = document.getElementById("total-count");
const activeCount = document.getElementById("active-count");
const completedCount = document.getElementById("completed-count");

const clearCompletedButton = document.getElementById("clear-completed");
const themeToggle = document.getElementById("theme-toggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let searchTerm = "";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function createTask(title, priority, dueDate) {
  return {
    id: crypto.randomUUID(),
    title,
    priority,
    dueDate,
    completed: false,
    createdAt: new Date().toISOString()
  };
}

function addTask(event) {
  event.preventDefault();

  const title = taskInput.value.trim();

  if (!title) {
    return;
  }

  const task = createTask(
    title,
    priorityInput.value,
    dateInput.value
  );

  tasks.unshift(task);

  saveTasks();
  renderTasks();

  taskForm.reset();
  priorityInput.value = "medium";
  taskInput.focus();
}

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id
      ? { ...task, completed: !task.completed }
      : task
  );

  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);

  saveTasks();
  renderTasks();
}

function clearCompleted() {
  tasks = tasks.filter((task) => !task.completed);

  saveTasks();
  renderTasks();
}

function getVisibleTasks() {
  return tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    let matchesFilter = true;

    if (currentFilter === "active") {
      matchesFilter = !task.completed;
    }

    if (currentFilter === "completed") {
      matchesFilter = task.completed;
    }

    return matchesSearch && matchesFilter;
  });
}

function formatDate(dateString) {
  if (!dateString) {
    return "";
  }

  const date = new Date(`${dateString}T00:00:00`);

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

function renderTasks() {
  const visibleTasks = getVisibleTasks();

  taskList.innerHTML = "";

  visibleTasks.forEach((task) => {
    const item = document.createElement("li");

    item.className = `task ${task.completed ? "completed" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute(
      "aria-label",
      `Mark ${task.title} as ${task.completed ? "active" : "completed"}`
    );

    checkbox.addEventListener("change", () => {
      toggleTask(task.id);
    });

    const content = document.createElement("div");
    content.className = "task-content";

    const title = document.createElement("p");
    title.className = "task-title";
    title.textContent = task.title;

    const meta = document.createElement("div");
    meta.className = "task-meta";

    const priority = document.createElement("span");
    priority.className = `priority priority-${task.priority}`;
    priority.textContent =
      `${task.priority.charAt(0).toUpperCase()}${task.priority.slice(1)}`;

    meta.appendChild(priority);

    if (task.dueDate) {
      const dueDate = document.createElement("span");
      dueDate.textContent = `Due ${formatDate(task.dueDate)}`;
      meta.appendChild(dueDate);
    }

    content.appendChild(title);
    content.appendChild(meta);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute(
      "aria-label",
      `Delete ${task.title}`
    );

    deleteButton.addEventListener("click", () => {
      deleteTask(task.id);
    });

    actions.appendChild(deleteButton);

    item.appendChild(checkbox);
    item.appendChild(content);
    item.appendChild(actions);

    taskList.appendChild(item);
  });

  emptyState.hidden = visibleTasks.length !== 0;

  updateStats();
}

function updateStats() {
  const completed = tasks.filter((task) => task.completed).length;

  totalCount.textContent = tasks.length;
  completedCount.textContent = completed;
  activeCount.textContent = tasks.length - completed;
}

function setFilter(event) {
  const button = event.target.closest("[data-filter]");

  if (!button) {
    return;
  }

  currentFilter = button.dataset.filter;

  document.querySelectorAll(".filter").forEach((filterButton) => {
    filterButton.classList.toggle(
      "active",
      filterButton === button
    );
  });

  renderTasks();
}

function loadTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀";
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");

  localStorage.setItem(
    "theme",
    isDark ? "dark" : "light"
  );

  themeToggle.textContent = isDark ? "☀" : "☾";
}

taskForm.addEventListener("submit", addTask);

searchInput.addEventListener("input", (event) => {
  searchTerm = event.target.value;
  renderTasks();
});

filters.addEventListener("click", setFilter);

clearCompletedButton.addEventListener(
  "click",
  clearCompleted
);

themeToggle.addEventListener(
  "click",
  toggleTheme
);

loadTheme();
renderTasks();