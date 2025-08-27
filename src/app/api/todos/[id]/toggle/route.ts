import { NextRequest, NextResponse } from 'next/server'
import { todoService } from '@/lib/todoService'
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

// POST - Marcar/desmarcar tarefa como concluída
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verificar autenticação
  const authError = checkAuth(request)
  if (authError) return authError

  try {
    const { id } = await params
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
