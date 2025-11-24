import { useState, useMemo } from "react";
import { Container } from "../../Ui/Container/Container";
import { TodoItem } from "../Item/TodoItem";
import "./TodoList.scss";
import { useTodo } from "../../../contexts/TodoContext";

export function TodoList() {
  const { todos } = useTodo();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const categorySet = new Set<string>();

    todos.forEach((todo) => {
      if (todo.category && todo.category.trim() !== "") {
        categorySet.add(todo.category.toLowerCase());
      }
    });

    return Array.from(categorySet).sort();
  }, [todos]);

  const filteredTodos = useMemo(() => {
    if (selectedCategory === "all") {
      return todos;
    }

    return todos.filter(
      (todo) =>
        todo.category &&
        todo.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [todos, selectedCategory]);

  const displayTodos = todos.length > 0 ? filteredTodos : todos;
  const displayCategories =
    todos.length > 0 ? categories : ["trabalho", "saúde", "estudos"];

  return (
    <>
      <Container content={false}>
        <div className="todo-list">
          <div className="todo-list__filters">
            <button
              className={`todo-list__filter-btn ${
                selectedCategory === "all" ? "active" : ""
              }`}
              onClick={() => setSelectedCategory("all")}
            >
              Todas
            </button>

            {displayCategories.map((category) => (
              <button
                key={category}
                className={`todo-list__filter-btn ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          <div className="todo-list__info">
            <span>
              {filteredTodos.length}{" "}
              {filteredTodos.length === 1 ? "tarefa" : "tarefas"}
              {selectedCategory !== "all" && ` em "${selectedCategory}"`}
            </span>
          </div>

          <div className="todo-list__items">
            {displayTodos.length === 0 ? (
              <div className="todo-list__empty">
                <div className="todo-list__empty-icon">●</div>
                <h3>Nenhuma tarefa encontrada</h3>
                <p>
                  {selectedCategory === "all"
                    ? "Comece adicionando sua primeira tarefa!"
                    : `Nenhuma tarefa encontrada na categoria "${selectedCategory}"`}
                </p>
              </div>
            ) : (
              displayTodos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
