import { useCallback } from "react";
import { useTodosStore } from "./store";

export function useTodoActions() {
  const { mergeTodoStoreData } = useTodosStore();
  const setLoadingTodos = useCallback(
    (value = true) => mergeTodoStoreData({ loading: value }),
    [mergeTodoStoreData]
  );

  const setSavingTodos = useCallback(
    (value = true) => mergeTodoStoreData({ saving: value }),
    [mergeTodoStoreData]
  );

  const setTodosLoadingError = useCallback(
    (error) => mergeTodoStoreData({ error }),
    [mergeTodoStoreData]
  );
  const setTodosSavingError = useCallback(
    (error) => mergeTodoStoreData({ error }),
    [mergeTodoStoreData]
  );

  const setTodos = useCallback(
    (todos) => {
      mergeTodoStoreData({ todos });
    },
    [mergeTodoStoreData]
  );

  const modifyTodo = useCallback(
    (todoId, modifiedData) => {
      mergeTodoStoreData(({ todos }) => {
        const targetTodoIndex = todos.findIndex((todo) => todo.id === todoId);
        if (targetTodoIndex === -1)
          throw new Error(`Cannot find todo with id: ${todoId}`);
        const newTodos = [...todos];
        const targetTodo = newTodos[targetTodoIndex];
        newTodos.splice(targetTodoIndex, 1, { ...targetTodo, ...modifiedData });
        return { todos: newTodos };
      });
    },
    [mergeTodoStoreData]
  );

  const addTodo = useCallback(
    (title, completed = false) => {
      mergeTodoStoreData(({ todos }) => {
        const newData = {
          todos: [
            ...todos,
            prepareTodo(title, completed, `user-todo-${todos.length}`),
          ],
        };
        return newData;
      });
    },
    [mergeTodoStoreData]
  );

  const deleteTodo = useCallback(
    (todoId) => {
      mergeTodoStoreData(({ todos }) => {
        return {
          todos: todos.filter((todo) => todo.id !== todoId),
        };
      });
    },
    [mergeTodoStoreData]
  );

  const markTodoAsComplete = useCallback(
    (todoId) => {
      modifyTodo(todoId, { completed: true });
    },
    [modifyTodo]
  );

  const markTodoAsUncomplete = useCallback(
    (todoId) => {
      modifyTodo(todoId, { completed: false });
    },
    [modifyTodo]
  );

  return {
    setLoadingTodos,
    setSavingTodos,
    setTodosLoadingError,
    setTodosSavingError,
    setTodos,
    addTodo,
    deleteTodo,
    markTodoAsComplete,
    markTodoAsUncomplete,
  };
}

function prepareTodo(title, completed, id) {
  return {
    id,
    createdAt: Date.now(),
    completed,
    title: title,
  };
}
