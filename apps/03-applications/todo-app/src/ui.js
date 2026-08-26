export function renderTodos(list, element, onToggle, onDelete) {
  element.replaceChildren();

  if (list.length === 0) {
    const emptyState = document.createElement("li");
    emptyState.className = "empty-state";
    emptyState.textContent = "No tasks yet.";
    element.appendChild(emptyState);
    return;
  }

  list.forEach(todo => {
    const li = document.createElement("li");
    li.className = "todo-item";

    if (todo.completed) {
      li.classList.add("completed");
    }

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.className = "todo-toggle";
    toggleButton.setAttribute("aria-pressed", String(todo.completed));
    toggleButton.setAttribute(
      "aria-label",
      todo.completed
        ? `Mark "${todo.text}" as active`
        : `Mark "${todo.text}" as completed`
    );

    const status = document.createElement("span");
    status.setAttribute("aria-hidden", "true");
    status.textContent = todo.completed ? "✔" : "○";

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    toggleButton.append(status, text);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "todo-delete";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete task "${todo.text}"`);

    toggleButton.addEventListener("click", () => onToggle(todo.id));
    deleteButton.addEventListener("click", () => onDelete(todo.id));

    li.append(toggleButton, deleteButton);

    li.classList.add("bump");
    setTimeout(() => li.classList.remove("bump"), 200);

    element.appendChild(li);
  });
}

export function updateStatus(list, element) {
  const total = list.length;
  const completed = list.filter(todo => todo.completed).length;

  element.textContent =
    total === 0 ? "No tasks." : `${completed} of ${total} tasks completed.`;
}
