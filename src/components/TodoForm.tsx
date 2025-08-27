'use client'

import { useState } from 'react'
import { todoService } from '@/lib/todoService'

interface TodoFormProps {
  onClose: () => void
  onSuccess: () => void
}

export default function TodoForm({ onClose, onSuccess }: TodoFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      alert('Por favor, insira um título para a tarefa.')
      return
    }

    try {
      setIsLoading(true)
      await todoService.createTodo({
        title: formData.title.trim(),
        description: formData.description.trim(),
        due_date: formData.due_date || null
      })
      
      setFormData({ title: '', description: '', due_date: '' })
      onSuccess()
    } catch (error) {
      console.error('Erro ao criar todo:', error)
      alert('Erro ao criar tarefa. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-black/10 backdrop-blur-sm rounded-lg p-6 w-full max-w-md border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Nova Tarefa</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Título *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-white placeholder-white/60 bg-black/10 backdrop-blur-sm"
              placeholder="Digite o título da tarefa"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-white placeholder-white/60 bg-black/10 backdrop-blur-sm"
              placeholder="Digite a descrição da tarefa"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Data de Vencimento
            </label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="w-full px-3 py-2 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-white bg-black/10 backdrop-blur-sm"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-black/10 backdrop-blur-sm text-white py-2 px-4 rounded-md hover:bg-black/20 disabled:opacity-50 transition-colors border border-white/20"
            >
              {isLoading ? 'Criando...' : 'Criar Tarefa'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-black/10 backdrop-blur-sm text-white py-2 px-4 rounded-md hover:bg-black/20 transition-colors border border-white/20"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 