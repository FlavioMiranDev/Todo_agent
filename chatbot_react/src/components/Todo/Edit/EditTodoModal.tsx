import "./EditTodoModal.scss";
import { useState, useEffect } from "react";
import { Modal } from "../../Ui/Modal/Modal";
import { Button } from "../../Ui/Button/Button";
import { useTodo } from "../../../contexts/TodoContext";

interface Todo {
  id: string;
  title: string;
  category: string | null;
  description: string | null;
  date: string | null;
  completed: boolean;
  created_at: string;
}

interface EditTodoModalProps {
  isOpen: boolean;
  todo: Todo | null;
}

export function EditTodoModal({ isOpen, todo }: EditTodoModalProps) {
  const { setEdit, updateTodo } = useTodo();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    date: "",
  });
  const onClose = () => {
    setEdit(null);
  };

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title,
        category: todo.category || "",
        description: todo.description || "",
        date: todo.date ? todo.date.slice(0, 16) : "",
      });
    }
  }, [todo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!todo) return;

    const updates = {
      title: formData.title,
      category: formData.category,
      description: formData.description,
      date: formData.date || null,
    };

    updateTodo(todo.id, updates);
    setEdit(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!todo) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Tarefa" size="md">
      <form className="edit-todo-form" onSubmit={handleSubmit}>
        <div className="edit-todo-form__group">
          <label htmlFor="edit-title">Título da Tarefa *</label>
          <input
            type="text"
            id="edit-title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="edit-todo-form__group">
          <label htmlFor="edit-category">Categoria</label>
          <input
            type="text"
            id="edit-category"
            name="category"
            placeholder="ex: trabalho, pessoal..."
            value={formData.category}
            onChange={handleChange}
          />
        </div>

        <div className="edit-todo-form__group">
          <label htmlFor="edit-date">Data e Hora</label>
          <input
            type="datetime-local"
            id="edit-date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <div className="edit-todo-form__group">
          <label htmlFor="edit-description">Descrição</label>
          <textarea
            id="edit-description"
            name="description"
            rows={4}
            placeholder="Detalhes da tarefa..."
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="edit-todo-form__actions">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            Salvar Alterações
          </Button>
        </div>
      </form>
    </Modal>
  );
}
