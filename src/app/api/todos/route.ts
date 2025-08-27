import { NextRequest, NextResponse } from 'next/server'
import { todoService } from '@/lib/todoService'
import { CreateTodoData } from '@/types/todo'

// POST - Criar nova tarefa
export async function POST(request: NextRequest) {
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

    // Formatar a data corretamente
    let dueDate = null
    if (body.due_date) {
      try {
        dueDate = new Date(body.due_date).toISOString().split('T')[0]
      } catch (error) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Formato de data inválido' 
          },
          { status: 400 }
        )
      }
    }

    const todoData: CreateTodoData = {
      title: body.title.trim(),
      description: body.description?.trim() || '',
      due_date: dueDate
    }

    const newTodo = await todoService.createTodo(todoData)
    
    if (!newTodo) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Erro ao criar tarefa no banco de dados' 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      data: newTodo 
    }, { status: 201 })
  } catch (error) {
    console.error('API Error - POST todo:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor' 
      },
      { status: 500 }
    )
  }
}

// GET - Buscar todas as tarefas
export async function GET(request: NextRequest) {
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