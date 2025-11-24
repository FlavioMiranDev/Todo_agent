import { useTodo } from "../../../contexts/TodoContext";
import type { Todo } from "../../../types/todo";
import { Button } from "../../Ui/Button/Button";
import "./TodoItem.scss";

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const { deleteTodo, setEdit, toggleCompleted } = useTodo();
  const completed = todo.completed == undefined ? false : todo.completed;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Sem data";

    try {
      const date = new Date(dateString);
      return `${date.toLocaleDateString("pt-BR")} ${date.toLocaleTimeString(
        "pt-BR",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      )}`;
    } catch {
      return "Data inválida";
    }
  };

  const handleToggleComplete = () => {
    toggleCompleted(todo.id, !completed);
  };

  const handleEdit = () => {
    setEdit(todo.id);
  };

  const handleDelete = () => {
    deleteTodo(todo.id);
  };

  return (
    <div className={`todo-item ${completed ? "completed" : ""}`}>
      <div className="todo-item__header">
        <div>
          <div className="todo-item__title">{todo.title}</div>
        </div>
        {todo.category && (
          <span className="todo-item__category">{todo.category}</span>
        )}
      </div>

      {todo.description && (
        <div className="todo-item__description">{todo.description}</div>
      )}

      <div className="todo-item__meta">
        <div className="todo-item__date">{formatDate(todo.date)}</div>
        <div className="todo-item__created">{formatDate(todo.created_at)}</div>
      </div>

      <div className="todo-item__actions">
        <Button
          variant={completed ? "primary" : "success"}
          size="icon"
          onClick={handleToggleComplete}
        >
          {completed ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-check2-all"
              viewBox="0 0 16 16"
            >
              <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0" />
              <path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-check2"
              viewBox="0 0 16 16"
            >
              <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0" />
            </svg>
          )}
        </Button>
        <Button variant="primary" size="icon" onClick={handleEdit}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-pencil"
            viewBox="0 0 16 16"
          >
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
          </svg>
        </Button>
        <Button variant="danger" size="icon" onClick={handleDelete}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-x"
            viewBox="0 0 16 16"
          >
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
