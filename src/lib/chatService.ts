export const chatService = {
  // Send message to chatbot
  async sendMessage(message: string): Promise<{ response: string }> {
    try {
      const response = await fetch('https://toinsane.app.n8n.cloud/webhook/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          timestamp: new Date().toISOString(),
          sessionId: 'user-session-' + Date.now()
        })
      })

      if (!response.ok) {
        throw new Error(`Error communicating with chatbot: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      
      // Check if response has 'output.answer' field (n8n format)
      if (result && result.output && result.output.answer && typeof result.output.answer === 'string') {
        return { response: result.output.answer }
      } else if (result && result.answers && typeof result.answers === 'string') {
        return { response: result.answers }
      } else if (result && typeof result.response === 'string') {
        // Fallback for old format
        return result
      } else if (result && typeof result === 'string') {
        // If response is just a string, convert to expected format
        return { response: result }
      } else {
        // If unable to process response, return default message
        return { response: 'Response received from chatbot' }
      }
    } catch (error) {
      console.error('Error sending message:', error)
      throw new Error('Error communicating with chatbot. Please try again.')
    }
  }
} 