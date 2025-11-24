/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import type { Todo } from "../types/todo";
import { apiClient } from "../api/httpClient";

interface TodoContextType {
  todos: Todo[];
  loading: boolean;
  onEditTodo: string | null;
  addTodo: (todo: Omit<Todo, "id" | "created_at">) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  refreshTodos: () => void;
  setEdit: (id: string | null) => void;
  toggleCompleted: (id: string, completed: boolean) => void;
}

const initialState: TodoContextType = {
  todos: [],
  loading: false,
  onEditTodo: null,
  addTodo: (todo: Omit<Todo, "id" | "created_at">) => {},
  updateTodo: (id: string, updates: Partial<Todo>) => {},
  deleteTodo: (id: string) => {},
  refreshTodos: () => {},
  setEdit: (id: string | null) => {},
  toggleCompleted: (id: string, completed: boolean) => {},
};

const TodoContext = createContext<TodoContextType>(initialState);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [onEditTodo, setOnEditTodo] = useState<string | null>(null);

  const refreshTodos = async () => {
    setLoading(true);

    const response = await apiClient.get<Todo[]>("todos");

    setTodos(response.data);
    setLoading(false);
  };

  const addTodo = async (todoData: Omit<Todo, "id" | "created_at">) => {
    await apiClient.post("todos", todoData);

    await refreshTodos();
  };

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    await apiClient.put(`todos/${id}`, updates);

    await refreshTodos();
  };

  const deleteTodo = async (id: string) => {
    await apiClient.delete(`todos/${id}`);

    await refreshTodos();
  };

  const setEdit = (id: string | null) => {
    setOnEditTodo(id);
  };

  const toggleCompleted = async (id: string, completed: boolean) => {
    await apiClient.put(`todos/complete/${id}?completed=${completed}`);

    await refreshTodos();
  };

  useEffect(() => {
    refreshTodos();
  }, []);

  return (
    <TodoContext.Provider
      value={{
        todos,
        loading,
        onEditTodo,
        addTodo,
        updateTodo,
        deleteTodo,
        refreshTodos,
        setEdit,
        toggleCompleted,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);

  return context;
};
