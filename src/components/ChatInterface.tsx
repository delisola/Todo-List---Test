'use client'

import { useState, useRef, useEffect } from 'react'
import { chatService } from '@/lib/chatService'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isChatVisible, setIsChatVisible] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Function to convert WhatsApp formatting to HTML
  const formatWhatsAppText = (text: string): string => {
    if (!text) return ''
    
    return text
      // Convert line breaks to <br>
      .replace(/\n/g, '<br>')
      // Convert **text** to <strong>text</strong> (bold)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Convert *text* to <em>text</em> (italic)
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Convert _text_ to <em>text</em> (alternative italic)
      .replace(/_(.*?)_/g, '<em>$1</em>')
      // Convert `text` to <code>text</code> (code)
      .replace(/`(.*?)`/g, '<code class="bg-gray-200 px-1 rounded text-xs">$1</code>')
      // Convert ~~text~~ to <del>text</del> (strikethrough)
      .replace(/~~(.*?)~~/g, '<del>$1</del>')
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentMessage = inputMessage
    setInputMessage('')
    setIsLoading(true)

    try {
      const result = await chatService.sendMessage(currentMessage)
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: result.response || 'Sorry, I could not process your message.',
        isUser: false,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, there was an error in communication. Please try again.',
        isUser: false,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible)
  }

  return (
    <>
      {/* Chat Interface */}
      <div className={`fixed bottom-0 right-0 w-[350px] h-full bg-white/30 backdrop-blur-sm border-l border-white/20 z-50 transition-transform duration-300 ease-in-out ${
        isChatVisible ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          <div className="bg-white/30 backdrop-blur-sm h-full flex flex-col shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-black text-sm">Chat Assistant</h3>
                  <p className="text-xs text-black/60">How can I help?</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-black/60">Online</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[280px] px-3 py-2 rounded-lg ${
                      message.isUser
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : 'bg-white/50 backdrop-blur-sm text-black border border-white/20'
                    }`}
                  >
                    {message.isUser ? (
                      <p className="text-xs leading-relaxed">{message.text}</p>
                    ) : (
                      <div 
                        className="text-xs leading-relaxed"
                        dangerouslySetInnerHTML={{ 
                          __html: formatWhatsAppText(message.text) 
                        }}
                      />
                    )}
                    <p className={`text-xs mt-1 ${
                      message.isUser ? 'text-blue-100' : 'text-black/50'
                    }`}>
                      {message.timestamp.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/50 backdrop-blur-sm text-black border border-white/20 rounded-lg px-3 py-2 max-w-[280px]">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-black/40 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-black/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1.5 h-1.5 bg-black/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-black/60">Typing...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/20">
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="w-full px-3 py-2 pr-10 bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-black placeholder-black/60 resize-none text-xs"
                    rows={1}
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="absolute right-1.5 top-1/2 transform -translate-y-1/2 p-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-200"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-xs text-black/50 mt-2 text-center">
                Press Enter to send
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:scale-110 transition-all duration-200 z-50 ${
          isChatVisible ? 'right-[370px]' : 'right-6'
        }`}
      >
        <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </button>
    </>
  )
} 