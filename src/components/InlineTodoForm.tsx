'use client'

import { useState } from 'react'
import { todoService } from '@/lib/todoService'

interface InlineTodoFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export default function InlineTodoForm({ onSuccess, onCancel }: InlineTodoFormProps) {
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
    <div className="bg-black/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
      <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-white">Nova Tarefa</h3>
                  <button
            onClick={onCancel}
            className="text-white/80 hover:text-white transition-colors"
          >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
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
            autoFocus
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
            rows={2}
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

        <div className="flex space-x-2 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-black/10 backdrop-blur-sm text-white py-2 px-4 rounded-md disabled:opacity-50 transition-colors duration-300 font-medium border border-white/20 hover:bg-black/20"
          >
            {isLoading ? 'Criando...' : 'Criar Tarefa'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-black/10 backdrop-blur-sm text-white py-2 px-4 rounded-md transition-colors duration-300 font-medium border border-white/20 hover:bg-black/20"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
} 