import { NextRequest, NextResponse } from 'next/server'
import { todoService } from '@/lib/todoService'

// POST - Marcar/desmarcar tarefa como concluída
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID da tarefa é obrigatório' 
        },
        { status: 400 }
      )
    }

    const body = await request.json()
    const completed = Boolean(body.completed)
    
    const updatedTodo = await todoService.toggleTodo(id, completed)
    
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
    console.error('API Error - POST toggle todo:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao atualizar status da tarefa' 
      },
      { status: 500 }
    )
  }
}
