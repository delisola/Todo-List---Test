// Criar arquivo de autenticação
export const API_KEYS = [
  process.env.API_KEY_1 || 'n8n-api-key-123',
  process.env.API_KEY_2 || 'n8n-api-key-456',
  // Adicione mais chaves conforme necessário
]

export function validateApiKey(authHeader: string | null): boolean {
  if (!authHeader) return false
  
  const apiKey = authHeader.replace('Bearer ', '')
  return API_KEYS.includes(apiKey)
} 