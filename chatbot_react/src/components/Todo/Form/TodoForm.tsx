import "./TodoForm.scss";
import { useState } from "react";
import { Button } from "../../Ui/Button/Button";
import { Container } from "../../Ui/Container/Container";
import { useTodo } from "../../../contexts/TodoContext";
import type { Todo } from "../../../types/todo";

interface TodoFormData {
  title: string;
  description: string;
  category: string;
  date: string;
}

const initialFormData = {
  title: "",
  description: "",
  category: "",
  date: "",
};

export function TodoForm() {
  const { addTodo } = useTodo();
  const [formData, setFormData] = useState<TodoFormData>(initialFormData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await addTodo(formData as Omit<Todo, "id" | "createdAt">);

    setFormData(initialFormData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Container content={false}>
      <form className="todo-form" onSubmit={handleSubmit}>
        <div className="todo-form__grid">
          <div className="todo-form__input">
            <label htmlFor="title">Título da Tarefa</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="O que precisa ser feito?"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="todo-form__input">
            <label htmlFor="category">Categoria</label>
            <input
              type="text"
              id="category"
              name="category"
              placeholder="ex: trabalho, pessoal..."
              value={formData.category}
              onChange={handleChange}
            />
          </div>

          <div className="todo-form__input">
            <label htmlFor="date">Data e Hora</label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className="todo-form__actions">
            <Button type="submit" variant="primary">
              <span>+</span>
              Adicionar
            </Button>
          </div>
        </div>

        <div className="todo-form__input full-width">
          <label htmlFor="description">Descrição (Opcional)</label>
          <textarea
            id="description"
            name="description"
            rows={2}
            placeholder="Detalhes da tarefa..."
            value={formData.description}
            onChange={handleChange}
          />
        </div>
      </form>
    </Container>
  );
}
