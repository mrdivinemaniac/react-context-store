import { useCallback, useEffect } from "react";
import { useTodosStore } from "./store";
import { useTodoActions } from "./actions";

export function useTodoSync() {
  const {
    setTodos,
    setLoadingTodos,
    setSavingTodos,
    setTodosLoadingError,
    setTodosSavingError,
  } = useTodoActions();

  const { todosError, loadingTodos, savingTodos } = useTodosStore();

  const loadTodosFromServer = useCallback(() => {
    setLoadingTodos(true);
    simulateFetch()
      .then((todos) => {
        setTodos(todos);
        setLoadingTodos(false);
      })
      .catch((e) => {
        setTodosLoadingError(e);
        setLoadingTodos(false);
      });
  }, [setTodos, setLoadingTodos, setTodosLoadingError]);

  const saveTodosToServer = useCallback(() => {
    setSavingTodos(true);
    simulateSave()
      .then(() => {
        setSavingTodos(false);
      })
      .catch((e) => {
        setTodosSavingError(e);
        setSavingTodos(false);
      });
  }, [setSavingTodos, setTodosSavingError]);

  return {
    loadTodosFromServer,
    saveTodosToServer,
    savingTodos,
    loadingTodos,
    todosError,
  };
}

/**
 * This hook automatically saves todos to the server
 * in a regular interval
 * @param {number} interval
 */
export function useTodoAutosave(interval) {
  const { saveTodosToServer, savingTodos, todosError } = useTodoSync();
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      saveTodosToServer();
    }, interval);
    return () => window.clearInterval(intervalId);
  }, [interval, saveTodosToServer]);

  return { savingTodos, todosError };
}

function simulateSave(todos) {
  return new Promise((resolve) => {
    setTimeout(resolve, 500);
  });
}

function simulateFetch() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "random-id-1234",
          createdAt: Date.now(),
          completed: true,
          title: "Make some coffee",
        },
        {
          id: "random-id-4567",
          createdAt: Date.now(),
          completed: false,
          title: "Make some more coffee",
        },
      ]);
    }, 500);
  });
}
