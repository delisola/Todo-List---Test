import { supabase } from './supabase'
import { Todo, CreateTodoData, UpdateTodoData } from '@/types/todo'

export const todoService = {
  // Get all todos
  async getAllTodos(): Promise<Todo[]> {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching todos:', error)
      return []
    }
  },

  // Create new todo
  async createTodo(todoData: CreateTodoData): Promise<Todo | null> {
    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([todoData])
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating todo:', error)
      throw error
    }
  },

  // Update todo
  async updateTodo(id: string, updates: UpdateTodoData): Promise<Todo | null> {
    try {
      const { data, error } = await supabase
        .from('todos')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating todo:', error)
      throw error
    }
  },

  // Delete todo
  async deleteTodo(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    } catch (error) {
      console.error('Error deleting todo:', error)
      throw error
    }
  },

  // Mark as done/undone
  async toggleTodo(id: string, completed: boolean): Promise<Todo | null> {
    return this.updateTodo(id, { completed })
  },

  // Enhance todo with AI via n8n webhook
  async enhanceTodo(id: string, prompt: string): Promise<Todo | null> {
    try {
      const response = await fetch(`/api/todos/${id}/enhance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY || 'n8n-api-key-123'}`
        },
        body: JSON.stringify({ prompt })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to enhance todo')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to enhance todo')
      }

      return result.data
    } catch (error) {
      console.error('Error enhancing todo:', error)
      throw error
    }
  }
} 