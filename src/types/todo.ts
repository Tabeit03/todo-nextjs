export interface Todo {
  id: string;
  todo: string;
  completed: boolean;
  userId: string;
  createdAt: number;
}

export interface TodoFormData {
  todo?: string;
  completed?: boolean;
}