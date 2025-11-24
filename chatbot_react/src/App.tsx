import "./App.scss";
import "./styles/globals.scss";
import { useState } from "react";
import { ChatContainer } from "./components/Chat/Container/ChatContainer";
import { TodoForm } from "./components/Todo/Form/TodoForm";
import { TodoList } from "./components/Todo/List/TodoList";
import { useTodo } from "./contexts/TodoContext";
import { EditTodoModal } from "./components/Todo/Edit/EditTodoModal";
import { PDFManager } from "./components/PDFManager/PDFManager";

function App() {
  const { todos, onEditTodo, refreshTodos } = useTodo();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const totalTasks = todos.length;
  const pendingTasks = todos.filter((todo) => !todo.completed).length;
  const completedTasks = todos.filter((todo) => todo.completed).length;

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="App">
      <PDFManager />
      <EditTodoModal
        isOpen={!!onEditTodo}
        todo={todos.find((todo) => todo.id === onEditTodo) || null}
      />
      <div className="app-container">
        <div className="main-panel">
          <header className="header">
            <div>
              <h1>TaskFlow</h1>
              <p>Gerencie suas tarefas com inteligência e estilo</p>
            </div>
          </header>

          <div className="stats">
            <div className="stat-card">
              <div className="stat-number">{totalTasks}</div>
              <div className="stat-label">Total de Tarefas</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{pendingTasks}</div>
              <div className="stat-label">Pendentes</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{completedTasks}</div>
              <div className="stat-label">Concluídas</div>
            </div>
          </div>

          <TodoForm />
          <TodoList />
        </div>

        <button className="chat-toggle" onClick={toggleChat}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-chat-left-dots-fill"
            viewBox="0 0 16 16"
          >
            <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
          </svg>
        </button>

        <ChatContainer
          isOpen={isChatOpen}
          onClose={() => {
            refreshTodos();
            setIsChatOpen(false);
          }}
        />
      </div>
    </div>
  );
}

export default App;
