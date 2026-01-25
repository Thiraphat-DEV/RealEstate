import apiClient from './api'

export interface CreateInquiryRequest {
  name: string
  email: string
  phone?: string
  question: string
}

export interface InquiryResponse {
  data: {
    _id: string
    name: string
    email: string
    phone?: string
    question: string
    status: string
    createdAt: string
    updatedAt: string
  }
  length: number
  error: null
  statusCode: number
}

export const inquiryService = {
  async submitInquiry(data: CreateInquiryRequest): Promise<InquiryResponse> {
    try {
      const response = await apiClient.post<InquiryResponse>('/inquiries', data)
      return response.data
    } catch (error: any) {
      console.error('inquiryService: Error submitting inquiry:', error)
      throw error
    }
  },
}
