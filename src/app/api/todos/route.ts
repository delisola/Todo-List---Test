import { NextRequest, NextResponse } from 'next/server'
import { todoService } from '@/lib/todoService'
import { CreateTodoData } from '@/types/todo'
import { validateApiKey } from '@/lib/auth'

// Função para verificar autenticação
function checkAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  
  if (!validateApiKey(authHeader)) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'API Key inválida ou ausente' 
      },
      { status: 401 }
    )
  }
  
  return null // Autenticação válida
}

// GET - Buscar todas as tarefas
export async function GET(request: NextRequest) {
  // Verificar autenticação
  const authError = checkAuth(request)
  if (authError) return authError

  try {
    const todos = await todoService.getAllTodos()
    return NextResponse.json({ 
      success: true, 
      data: todos 
    })
  } catch (error) {
    console.error('API Error - GET todos:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao buscar tarefas' 
      },
      { status: 500 }
    )
  }
}

// POST - Criar nova tarefa
export async function POST(request: NextRequest) {
  // Verificar autenticação
  const authError = checkAuth(request)
  if (authError) return authError

  try {
    const body = await request.json()
    
    // Validação básica
    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Título é obrigatório' 
        },
        { status: 400 }
      )
    }

    const todoData: CreateTodoData = {
      title: body.title.trim(),
      description: body.description?.trim() || '',
      due_date: body.due_date || null
    }

    const newTodo = await todoService.createTodo(todoData)
    
    return NextResponse.json({ 
      success: true, 
      data: newTodo 
    }, { status: 201 })
  } catch (error) {
    console.error('API Error - POST todo:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao criar tarefa' 
      },
      { status: 500 }
    )
  }
} 