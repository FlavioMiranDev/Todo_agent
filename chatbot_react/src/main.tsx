import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App.tsx";
import { ChatProvider } from "./contexts/ChatContext.tsx";
import { TodoProvider } from "./contexts/TodoContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TodoProvider>
      <ChatProvider>
        <App />
      </ChatProvider>
    </TodoProvider>
  </StrictMode>
);
