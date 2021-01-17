import React from "react";

export function TodoViewer({
  todos,
  onMarkAsComplete,
  onDelete,
  onMarkAsUncomplete,
}) {
  return (
    <ol>
      {todos.map((todo) => (
        <li style={{ padding: "5px 0" }} key={todo.id}>
          {todo.title}
          {!todo.completed ? (
            <ActionButton
              onClick={() => onMarkAsComplete(todo)}
              title="Mark As Complete"
            >
              ✅
            </ActionButton>
          ) : (
            <ActionButton
              onClick={() => onMarkAsUncomplete(todo)}
              title="Mark As Uncomplete"
            >
              🚧
            </ActionButton>
          )}
          <ActionButton onClick={() => onDelete(todo)} title="Delete">
            🗑
          </ActionButton>
        </li>
      ))}
    </ol>
  );
}

function ActionButton({ onClick, children, title }) {
  return (
    <span
      title={title}
      onClick={onClick}
      style={{ margin: "0 2px", cursor: "pointer" }}
    >
      {children}
    </span>
  );
}
