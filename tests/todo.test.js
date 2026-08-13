import { createTodo, toggle, remove } from "../src/todo.js";

describe("Todo logic", () => {
  test("createTodo creates the correct structure", () => {
    const todo = createTodo("Test task");

    expect(todo.text).toBe("Test task");
    expect(todo.completed).toBe(false);
    expect(typeof todo.id).toBe("string");
  });

  test("createTodo removes surrounding whitespace", () => {
    const todo = createTodo("  Test task  ");
    expect(todo.text).toBe("Test task");
  });

  test("createTodo rejects empty text", () => {
    expect(() => createTodo("   ")).toThrow("Todo text cannot be empty.");
  });

  test("toggle changes completed state", () => {
    const todo = createTodo("Test");
    const updated = toggle(todo);

    expect(updated.completed).toBe(true);
  });

  test("toggle does not mutate the original todo", () => {
    const todo = createTodo("Test");
    const updated = toggle(todo);

    expect(todo.completed).toBe(false);
    expect(updated.completed).toBe(true);
  });

  test("remove deletes the correct todo", () => {
    const first = createTodo("A");
    const second = createTodo("B");

    const newList = remove([first, second], first.id);

    expect(newList).toHaveLength(1);
    expect(newList[0].id).toBe(second.id);
  });
});
