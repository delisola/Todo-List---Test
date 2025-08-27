export interface Todo {
  id: string
  title: string
  description: string
  due_date: string | null
  completed: boolean
  created_at: string
  updated_at: string
}

export interface CreateTodoData {
  title: string
  description: string
  due_date: string | null
}

export interface UpdateTodoData {
  title?: string
  description?: string
  due_date?: string | null
  completed?: boolean
} 