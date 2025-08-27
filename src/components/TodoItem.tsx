'use client'

import { useState } from 'react'
import { Todo } from '@/types/todo'
import { todoService } from '@/lib/todoService'

interface TodoItemProps {
  todo: Todo
  onUpdate: () => void
}

export default function TodoItem({ todo, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showAIImprove, setShowAIImprove] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const [editData, setEditData] = useState({
    title: todo.title,
    description: todo.description,
    due_date: todo.due_date || ''
  })

  const handleToggleComplete = async () => {
    try {
      await todoService.toggleTodo(todo.id, !todo.completed)
      onUpdate()
    } catch (error) {
      console.error('Erro ao atualizar todo:', error)
    }
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      await todoService.updateTodo(todo.id, editData)
      setIsEditing(false)
      onUpdate()
    } catch (error) {
      console.error('Erro ao salvar todo:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        await todoService.deleteTodo(todo.id)
        onUpdate()
      } catch (error) {
        console.error('Erro ao excluir todo:', error)
      }
    }
  }

  const handleAIImprove = async () => {
    if (!aiPrompt.trim()) return
    
    try {
      setIsLoading(true)
      // Aqui você pode integrar com uma API de IA como OpenAI
      // Por enquanto, vou simular uma melhoria simples
      const improvedTitle = `${editData.title} (Melhorado)`
      const improvedDescription = `${editData.description}\n\nMelhorias sugeridas pela IA: ${aiPrompt}`
      
      await todoService.updateTodo(todo.id, {
        title: improvedTitle,
        description: improvedDescription
      })
      
      setEditData({
        title: improvedTitle,
        description: improvedDescription,
        due_date: editData.due_date
      })
      
      setShowAIImprove(false)
      setAiPrompt('')
      onUpdate()
    } catch (error) {
      console.error('Erro ao melhorar com IA:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-xl p-4 mb-3 bg-black/10 backdrop-blur-sm border border-white/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <button
            onClick={handleToggleComplete}
            className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center transition-colors ${
              todo.completed 
                ? 'bg-white border-white' 
                : 'border-white/60 hover:border-white'
            }`}
          >
            {todo.completed && (
              <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-white placeholder-white/60 bg-black/10 backdrop-blur-sm"
                  placeholder="Título da tarefa"
                />
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-white placeholder-white/60 bg-black/10 backdrop-blur-sm"
                  placeholder="Descrição da tarefa"
                  rows={3}
                />
                <input
                  type="date"
                  value={editData.due_date}
                  onChange={(e) => setEditData({ ...editData, due_date: e.target.value })}
                  className="px-3 py-2 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-white bg-black/10 backdrop-blur-sm"
                />
                
                {showAIImprove && (
                  <div className="space-y-2">
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="w-full px-3 py-2 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-white placeholder-white/60 bg-black/10 backdrop-blur-sm"
                      placeholder="Digite seu prompt para a IA..."
                      rows={2}
                    />
                    <button
                      onClick={handleAIImprove}
                      disabled={isLoading}
                      className="px-4 py-2 bg-black/10 backdrop-blur-sm text-white rounded-md disabled:opacity-50 transition-all duration-300 font-medium hover:scale-105 border border-white/20"
                    >
                      {isLoading ? 'Processando...' : 'Aplicar Melhorias'}
                    </button>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-4 py-2 bg-black/10 backdrop-blur-sm text-white rounded-md disabled:opacity-50 transition-all duration-300 font-medium hover:scale-105 border border-white/20"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-black/10 backdrop-blur-sm text-white rounded-md transition-all duration-300 font-medium hover:scale-105 border border-white/20"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => setShowAIImprove(!showAIImprove)}
                    className="px-4 py-2 bg-black/10 backdrop-blur-sm text-white rounded-md transition-all duration-300 font-medium hover:scale-105 border border-white/20"
                  >
                    Aperfeiçoar com AI
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className={`font-medium ${todo.completed ? 'line-through text-white/60' : 'text-white'}`}>
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className={`text-sm mt-1 ${todo.completed ? 'text-white/50' : 'text-white/80'}`}>
                    {todo.description}
                  </p>
                )}
                {todo.due_date && (
                  <p className={`text-xs mt-1 ${todo.completed ? 'text-white/50' : 'text-white/70'}`}>
                    Data: {new Date(todo.due_date).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        
        {!isEditing && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-white/80 hover:text-red-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 