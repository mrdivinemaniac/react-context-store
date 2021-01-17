import React from "react";
import { StoreProvider } from "./store/index";
import { Todo } from "./Todo/index";

export function App() {
  return (
    <StoreProvider>
      <Todo />
    </StoreProvider>
  );
}
