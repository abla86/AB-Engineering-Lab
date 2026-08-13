function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createTodo(text) {
  const cleanText = text.trim();

  if (!cleanText) {
    throw new Error("Todo text cannot be empty.");
  }

  return {
    id: createId(),
    text: cleanText,
    completed: false
  };
}

export function toggle(todo) {
  return {
    ...todo,
    completed: !todo.completed
  };
}

export function remove(list, id) {
  return list.filter(todo => todo.id !== id);
}
