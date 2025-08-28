'use client'

import { useState } from 'react'
import { Todo } from '@/types/todo'
import { todoService } from '@/lib/todoService'

interface TodoItemProps {
  todo: Todo
  onUpdate: (updatedTodo: Todo) => void
  onDelete: (todoId: string) => void
}

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
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
      const updatedTodo = await todoService.toggleTodo(todo.id, !todo.completed)
      if (updatedTodo) {
        onUpdate(updatedTodo)
      }
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      const updatedTodo = await todoService.updateTodo(todo.id, editData)
      if (updatedTodo) {
        onUpdate(updatedTodo)
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error saving todo:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await todoService.deleteTodo(todo.id)
      onDelete(todo.id)
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const handleAIImprove = async () => {
    if (!aiPrompt.trim()) return
    
    try {
      setIsLoading(true)
      
      // Usar o novo endpoint de enhance que conecta com n8n
      const updatedTodo = await todoService.enhanceTodo(todo.id, aiPrompt)
      
      if (updatedTodo) {
        setEditData({
          title: updatedTodo.title,
          description: updatedTodo.description,
          due_date: updatedTodo.due_date || ''
        })
        
        onUpdate(updatedTodo)
        setShowAIImprove(false)
        setAiPrompt('')
      }
    } catch (error) {
      console.error('Error improving with AI:', error)
      alert('Erro ao melhorar tarefa com IA. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-xl p-4 mb-3 bg-white/30 backdrop-blur-sm border border-white/20">
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
                  className="w-full px-3 py-2 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-black/75 placeholder-white/60 bg-white/30 backdrop-blur-sm text-sm"
                  placeholder="Task title"
                />
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-black/75 placeholder-white/60 bg-white/30 backdrop-blur-sm text-sm"
                  placeholder="Task description"
                  rows={3}
                />
                <input
                  type="date"
                  value={editData.due_date}
                  onChange={(e) => setEditData({ ...editData, due_date: e.target.value })}
                  className="w-full px-3 py-2 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-black/75 bg-white/30 backdrop-blur-sm text-sm"
                />
                
                {showAIImprove && (
                  <div className="space-y-2">
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="w-full px-3 py-2 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-black/75 placeholder-white/60 bg-white/30 backdrop-blur-sm text-sm"
                      placeholder="Enter your AI prompt..."
                      rows={2}
                    />
                    <button
                      onClick={handleAIImprove}
                      disabled={isLoading}
                      className="px-4 py-2 bg-white/30 backdrop-blur-sm text-black rounded-md disabled:opacity-50 transition-all duration-300 font-medium hover:scale-105 border border-white/20 text-sm"
                    >
                      {isLoading ? 'Processing...' : 'Apply Improvements'}
                    </button>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-4 py-2 flex-1 bg-white/30 backdrop-blur-sm text-black rounded-md disabled:opacity-50 transition-all duration-300 font-medium hover:scale-105 border border-white/20 text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 flex-1 bg-white/30 backdrop-blur-sm text-black rounded-md transition-all duration-300 font-medium hover:scale-105 border border-white/20 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowAIImprove(!showAIImprove)}
                    className="px-4 py-2 flex-1 bg-white/30 backdrop-blur-sm text-black rounded-md transition-all duration-300 font-medium hover:scale-105 border border-white/20 text-sm"
                  >
                    Enhance with AI
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className={`font-medium ${todo.completed ? 'line-through text-black/60' : 'text-black'}`}>
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className={`text-sm mt-1 ${todo.completed ? 'text-black/50' : 'text-black/80'}`}>
                    {todo.description}
                  </p>
                )}
                {todo.due_date && (
                  <p className={`text-xs mt-1 ${todo.completed ? 'text-black/50' : 'text-black/70'}`}>
                    Date: {new Date(todo.due_date).toLocaleDateString('en-US')}
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
              className="p-2 text-black/80 hover:text-black transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-black/80 hover:text-red-300 transition-colors"
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