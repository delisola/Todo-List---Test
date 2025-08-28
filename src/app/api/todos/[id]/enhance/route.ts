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

// POST - Melhorar tarefa com IA via webhook n8n
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request)
  if (authError) return authError

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
    
    if (!body.prompt || typeof body.prompt !== 'string') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Prompt é obrigatório' 
        },
        { status: 400 }
      )
    }

    // Buscar a tarefa atual
    const todos = await todoService.getAllTodos()
    const currentTodo = todos.find(t => t.id === id)
    
    if (!currentTodo) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Tarefa não encontrada' 
        },
        { status: 404 }
      )
    }

    // Enviar dados para o webhook do n8n
    const n8nResponse = await fetch('https://toinsane.app.n8n.cloud/webhook/enhance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        todoId: id,
        currentTitle: currentTodo.title,
        currentDescription: currentTodo.description,
        currentDueDate: currentTodo.due_date,
        userPrompt: body.prompt,
        timestamp: new Date().toISOString()
      })
    })

    if (!n8nResponse.ok) {
      console.error('N8N webhook error:', await n8nResponse.text())
      return NextResponse.json(
        { 
          success: false, 
          error: 'Erro ao processar com IA' 
        },
        { status: 500 }
      )
    }

    const n8nResult = await n8nResponse.json()
    
    // Verificar se o n8n retornou dados melhorados
    if (n8nResult.success && n8nResult.enhancedData) {
      const { enhancedTitle, enhancedDescription } = n8nResult.enhancedData
      
      // Atualizar a tarefa com as melhorias do n8n
      const updatedTodo = await todoService.updateTodo(id, {
        title: enhancedTitle || currentTodo.title,
        description: enhancedDescription || currentTodo.description
      })
      
      if (!updatedTodo) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Erro ao atualizar tarefa' 
          },
          { status: 500 }
        )
      }

      return NextResponse.json({ 
        success: true, 
        data: updatedTodo,
        n8nResponse: n8nResult
      })
    } else {
      // Se o n8n não retornou dados melhorados, usar fallback
      const fallbackTitle = `${currentTodo.title} (Enhanced)`
      const fallbackDescription = `${currentTodo.description}\n\n💡 Melhorias sugeridas: ${body.prompt}`
      
      const updatedTodo = await todoService.updateTodo(id, {
        title: fallbackTitle,
        description: fallbackDescription
      })
      
      return NextResponse.json({ 
        success: true, 
        data: updatedTodo,
        n8nResponse: n8nResult,
        fallback: true
      })
    }

  } catch (error) {
    console.error('API Error - POST enhance todo:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao melhorar tarefa com IA' 
      },
      { status: 500 }
    )
  }
} 