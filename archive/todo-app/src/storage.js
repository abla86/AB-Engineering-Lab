const KEY = "todos";

export function loadTodos() {
  try {
    const storedTodos = localStorage.getItem(KEY);

    if (!storedTodos) {
      return [];
    }

    const parsedTodos = JSON.parse(storedTodos);
    return Array.isArray(parsedTodos) ? parsedTodos : [];
  } catch {
    return [];
  }
}

export function saveTodos(todos) {
  try {
    localStorage.setItem(KEY, JSON.stringify(todos));
  } catch {
    console.error("Unable to save tasks to localStorage.");
  }
}
