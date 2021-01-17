import { createStore } from "../../../../src/index";

const { Provider, useStore } = createStore({
  loading: false,
  saving: false,
  todos: [],
  loadingError: null,
  savingError: null,
});

export const TodosStoreProvider = Provider;

export function useTodosStore() {
  const { data, setData, mergeData } = useStore();
  const { todos, loading, saving, loadingError, savingError } = data;
  return {
    todos,
    loadingTodos: loading,
    savingTodos: saving,
    todosLoadingError: loadingError,
    todosSavingError: savingError,
    setTodoStoreData: setData,
    mergeTodoStoreData: mergeData,
  };
}
