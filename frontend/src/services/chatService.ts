import apiClient from './api'

export interface ChatTurn {
  role: 'user' | 'model'
  text: string
}

export interface ChatMessageRequest {
  message: string
  history?: ChatTurn[]
}

export interface ChatMessageResponse {
  data: { reply: string }
  length: number
  error: null | string
  statusCode: number
}

export interface ChatStatusResponse {
  data: { available: boolean; hint?: string | null }
  length: number
  error: null | string
  statusCode: number
}

export const chatService = {
  async sendMessage(payload: ChatMessageRequest): Promise<ChatMessageResponse> {
    const response = await apiClient.post<ChatMessageResponse>(
      '/chat/message',
      payload
    )
    return response.data
  },

  async getStatus(): Promise<ChatStatusResponse> {
    const response = await apiClient.get<ChatStatusResponse>('/chat/status')
    return response.data
  },
}
