'use client'

import { useState, useEffect } from 'react'
import { Todo } from '@/types/todo'
import { todoService } from '@/lib/todoService'
import TodoItem from './TodoItem'
import InlineTodoForm from './InlineTodoForm'

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showInlineForm, setShowInlineForm] = useState(false)

  const loadTodos = async () => {
    try {
      setIsLoading(true)
      const data = await todoService.getAllTodos()
      setTodos(data)
    } catch (error) {
      console.error('Error loading todos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTodos()
  }, [])

  const completedTodos = todos.filter(todo => todo.completed)
  const pendingTodos = todos.filter(todo => !todo.completed)

  const handleFormSuccess = () => {
    setShowInlineForm(false)
    loadTodos()
  }

  // Function to update a specific task without reloading the entire list
  const handleTodoUpdate = (updatedTodo: Todo) => {
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === updatedTodo.id ? updatedTodo : todo
      )
    )
  }

  // Function to remove a specific task without reloading the entire list
  const handleTodoDelete = (todoId: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId))
  }

  // Function to add a new task without reloading the entire list
  const handleTodoCreate = (newTodo: Todo) => {
    setTodos(prevTodos => [newTodo, ...prevTodos])
  }

  return (
    <>
      <div className="bg-noise"></div>
      
      {/* Floating Background Text */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="text-white/10 text-[20rem] font-black tracking-wider select-none transform -rotate-12">
          TO DO LIST
        </div>
      </div>
      
      {/* Floating Paragraphs - Left aligned outside the tasks container */}
      <div className="fixed left-1/2 transform -translate-x-[425px] top-1/2 translate-y-[100px] pointer-events-none z-0">
        <div className="w-[250px] text-left space-y-3">
          <p className='text-white/25 text-[.75rem] tracking-wider select-none transform'>
            This application is an intelligent assistant for task management (ToDo List).
            It is designed to understand natural language messages from users, identify the intention (such as creating, editing, deleting, searching, or listing tasks) and execute the corresponding action automatically.
          </p>
          <p className='text-white/25 text-[.75rem] tracking-wider select-none transform'>
            Additionally, the assistant has a confirmation state: whenever it identifies that the title of a new message may be related to an existing task, it generates a validation question for the user before executing the action. This ensures greater accuracy and prevents unwanted changes.
          </p>
        </div>
      </div>
      
      <div className="main-container container mx-auto px-4 py-8 relative z-10">

        {/* Add Task Button */}
        <div className="text-center mb-6">
          <button
            onClick={() => setShowInlineForm(true)}
            className="bg-white/30 backdrop-blur-sm text-black px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center mx-auto border border-white/20"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Task
          </button>
        </div>

        {/* Inline Form - Moved outside the tasks condition */}
        {showInlineForm && (
          <div className="max-w-[600px] mx-auto mb-6">
            <InlineTodoForm 
              onSuccess={(newTodo) => {
                handleTodoCreate(newTodo)
                setShowInlineForm(false)
              }} 
              onCancel={() => setShowInlineForm(false)} 
            />
          </div>
        )}

        {/* Tasks Section - Max width 600px */}
        <div className="max-w-[600px] mx-auto">
          <div className="bg-white/25 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-black">Tasks</h2>
              <button className="text-black/80 hover:text-black transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/60 mx-auto"></div>
                <p className="text-black/80 mt-2">Loading tasks...</p>
              </div>
            ) : todos.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-black/80">No tasks found. Create your first task!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Task list */}
                {todos.map((todo) => (
                  <TodoItem 
                    key={todo.id} 
                    todo={todo} 
                    onUpdate={handleTodoUpdate}
                    onDelete={handleTodoDelete}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
            <div className="text-black">
              <p className="text-lg font-medium">Progress: {completedTodos.length}/{todos.length}</p>
              <p className="text-sm text-black/80">
                Completed: {completedTodos.length} | Pending: {pendingTodos.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 