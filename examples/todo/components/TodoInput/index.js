import React, { useState } from "react";

export function TodoInput({ onAddTodo }) {
  const [title, setTitle] = useState("");
  const handleInputChange = (e) => {
    setTitle(e.target.value);
  };
  const handleAddTodo = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    onAddTodo(trimmedTitle);
    setTitle("");
  };

  return (
    <div>
      <input
        placeholder="Add a new Todo"
        style={{ padding: "5px", marginRight: "5px", width: "400px" }}
        onChange={handleInputChange}
        value={title}
      />
      <button style={{ padding: "5px" }} onClick={handleAddTodo}>
        {" "}
        Add{" "}
      </button>
    </div>
  );
}
