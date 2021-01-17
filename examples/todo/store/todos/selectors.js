import { useTodosStore } from "./store";

export function useCompletedTodos() {
  const { todos } = useTodosStore();
  return todos.filter((task) => task.completed);
}

export function useUncompletedTodos() {
  const { todos } = useTodosStore();
  return todos.filter((task) => !task.completed);
}

export function useAllTodos() {
  const { todos } = useTodosStore();
  return todos;
}
