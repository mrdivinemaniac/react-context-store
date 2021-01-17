import React, { useEffect, useState } from "react";
import { TodoInput } from "../components/TodoInput/index";
import { TodoSwitcher, TODO_TYPES } from "../components/TodoSwitcher/index";
import {
  useTodoActions,
  useTodoAutosave,
  useTodoSync,
  useCompletedTodos,
  useUncompletedTodos,
  useAllTodos,
} from "../store/todos/index";
import { TodoViewer } from "../components/TodoViewer/index";

export function Todo() {
  const {
    addTodo,
    markTodoAsComplete,
    markTodoAsUncomplete,
    deleteTodo,
  } = useTodoActions();
  const { loadTodosFromServer, loadingTodos, savingTodos } = useTodoSync();
  const [activeTodoType, setActiveTodoType] = useState(TODO_TYPES.ALL);

  useTodoAutosave(5000);
  useEffect(() => loadTodosFromServer(), [loadTodosFromServer]);

  const handleAddTodo = (title) => {
    addTodo(title, activeTodoType === TODO_TYPES.COMPLETED);
  };

  const { todos, completedTodosCount, uncompletedTodosCount } = useTodoByType(
    activeTodoType
  );

  if (loadingTodos) {
    return <div> Loading... </div>;
  }

  return (
    <div>
      <div style={{ padding: "5px 0" }}>
        {savingTodos ? "Syncing..." : "Synced to Server"}
      </div>
      <TodoInput onAddTodo={handleAddTodo} />
      <div style={{ padding: "10px 0" }}>
        <TodoSwitcher
          onTodoSwitch={setActiveTodoType}
          completedCount={completedTodosCount}
          uncompletedCount={uncompletedTodosCount}
        />
      </div>
      <TodoViewer
        todos={todos}
        onMarkAsComplete={(todo) => markTodoAsComplete(todo.id)}
        onMarkAsUncomplete={(todo) => markTodoAsUncomplete(todo.id)}
        onDelete={(todo) => deleteTodo(todo.id)}
      />
    </div>
  );
}

function useTodoByType(type) {
  const allTodos = useAllTodos();
  const completedTodos = useCompletedTodos();
  const uncompletedTodos = useUncompletedTodos();
  const completedTodosCount = completedTodos.length;
  const uncompletedTodosCount = uncompletedTodos.length;
  switch (type) {
    case TODO_TYPES.ALL:
      return { todos: allTodos, completedTodosCount, uncompletedTodosCount };
    case TODO_TYPES.COMPLETED:
      return {
        todos: completedTodos,
        completedTodosCount,
        uncompletedTodosCount,
      };
    case TODO_TYPES.UNCOMPELTED:
      return {
        todos: uncompletedTodos,
        completedTodosCount,
        uncompletedTodosCount,
      };
    default:
      throw new Error(`Unknown Todo type: ${type}`);
  }
}
