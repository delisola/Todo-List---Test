'use client'

import { useState } from 'react'
import { Todo } from '@/types/todo'
import { todoService } from '@/lib/todoService'

interface InlineTodoFormProps {
  onSuccess: (newTodo: Todo) => void
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
      alert('Please enter a title for the task.')
      return
    }

    try {
      setIsLoading(true)
      const newTodo = await todoService.createTodo({
        title: formData.title.trim(),
        description: formData.description.trim(),
        due_date: formData.due_date || null
      })
      
      if (newTodo) {
        setFormData({ title: '', description: '', due_date: '' })
        onSuccess(newTodo)
      }
    } catch (error) {
      console.error('Error creating todo:', error)
      alert('Error creating task. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
      <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-black">New Task</h3>
                  <button
            onClick={onCancel}
            className="text-black/80 hover:text-black transition-colors"
          >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-black/75 placeholder-white/60 bg-white/30 backdrop-blur-sm text-sm"
                          placeholder="Enter task title"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-black/75 placeholder-white/60 bg-white/30 backdrop-blur-sm text-sm"
                          placeholder="Enter task description"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Due Date
          </label>
          <input
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            className="w-full px-3 py-2 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-black/75 bg-white/30 backdrop-blur-sm text-sm"
          />
        </div>

        <div className="flex space-x-2 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-white/30 backdrop-blur-sm text-black py-2 px-4 rounded-md disabled:opacity-50 transition-colors duration-300 font-medium border border-white/20 hover:bg-white/40 text-sm"
          >
            {isLoading ? 'Creating...' : 'Create Task'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-white/30 backdrop-blur-sm text-black py-2 px-4 rounded-md transition-colors duration-300 font-medium border border-white/20 hover:bg-white/40 text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
} 