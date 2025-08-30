'use client'

import { useState, useCallback } from 'react'
import TodoList from '@/components/TodoList'
import ChatInterface from '@/components/ChatInterface'

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleChatResponse = useCallback(() => {
    // Trigger a refresh of the todo list when chat receives a response
    setRefreshTrigger(prev => prev + 1)
  }, [])

  return (
    <main>
      <TodoList refreshTrigger={refreshTrigger} />
      <ChatInterface onResponseReceived={handleChatResponse} />
    </main>
  )
}
