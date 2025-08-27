import { NextRequest, NextResponse } from 'next/server'
import { todoService } from '@/lib/todoService'
import { UpdateTodoData } from '@/types/todo'

// GET - Buscar tarefa específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const todos = await todoService.getAllTodos()
    const todo = todos.find(t => t.id === id)
    
    if (!todo) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Tarefa não encontrada' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      data: todo 
    })
  } catch (error) {
    console.error('API Error - GET todo by id:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao buscar tarefa' 
      },
      { status: 500 }
    )
  }
}

// PUT - Atualizar tarefa
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const updateData: UpdateTodoData = {}
    
    if (body.title !== undefined) {
      if (!body.title || typeof body.title !== 'string') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Título não pode ser vazio' 
          },
          { status: 400 }
        )
      }
      updateData.title = body.title.trim()
    }
    
    if (body.description !== undefined) {
      updateData.description = body.description?.trim() || ''
    }
    
    if (body.due_date !== undefined) {
      updateData.due_date = body.due_date || null
    }
    
    if (body.completed !== undefined) {
      updateData.completed = Boolean(body.completed)
    }

    const updatedTodo = await todoService.updateTodo(id, updateData)
    
    if (!updatedTodo) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Tarefa não encontrada' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedTodo 
    })
  } catch (error) {
    console.error('API Error - PUT todo:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao atualizar tarefa' 
      },
      { status: 500 }
    )
  }
}

// DELETE - Excluir tarefa
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await todoService.deleteTodo(id)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Tarefa excluída com sucesso' 
    })
  } catch (error) {
    console.error('API Error - DELETE todo:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao excluir tarefa' 
      },
      { status: 500 }
    )
  }
} 