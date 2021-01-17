import React from "react";

export const TODO_TYPES = {
  ALL: "all",
  COMPLETED: "completed",
  UNCOMPELTED: "uncompleted",
};

export function TodoSwitcher({
  onTodoSwitch,
  uncompletedCount = 0,
  completedCount = 0,
}) {
  const totalCount = completedCount + uncompletedCount;
  return (
    <div>
      <SwitchButton onClick={() => onTodoSwitch(TODO_TYPES.ALL)}>
        All ({totalCount})
      </SwitchButton>
      <SwitchButton onClick={() => onTodoSwitch(TODO_TYPES.UNCOMPELTED)}>
        Uncompleted ({uncompletedCount})
      </SwitchButton>
      <SwitchButton onClick={() => onTodoSwitch(TODO_TYPES.COMPLETED)}>
        Completed ({completedCount})
      </SwitchButton>
    </div>
  );
}

function SwitchButton({ onClick, children }) {
  return (
    <button style={{ padding: "5px", marginRight: "5px" }} onClick={onClick}>
      {children}
    </button>
  );
}
