export interface Todo {
  id: string;
  title: string;
  category: string | null;
  description: string | null;
  date: string | null;
  completed: boolean;
  created_at: string;
}
