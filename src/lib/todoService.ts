import { supabase } from './supabase'
import { Todo, CreateTodoData, UpdateTodoData } from '@/types/todo'

export const todoService = {
  // Buscar todos os todos
  async getAllTodos(): Promise<Todo[]> {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao buscar todos:', error)
      return []
    }
  },

  // Criar novo todo
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
      console.error('Erro ao criar todo:', error)
      throw error
    }
  },

  // Atualizar todo
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
      console.error('Erro ao atualizar todo:', error)
      throw error
    }
  },

  // Excluir todo
  async deleteTodo(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    } catch (error) {
      console.error('Erro ao excluir todo:', error)
      throw error
    }
  },

  // Marcar como feito/não feito
  async toggleTodo(id: string, completed: boolean): Promise<Todo | null> {
    return this.updateTodo(id, { completed })
  }
} 