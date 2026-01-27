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

export interface Inquiry {
  _id: string
  name: string
  email: string
  phone?: string
  question: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface InquiryListResponse {
  data: Inquiry[]
  length: number
  error: null | string
  statusCode: number
}

export interface UpdateInquiryStatusRequest {
  status: 'pending' | 'in_progress' | 'resolved' | 'closed'
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

  async getAllInquiries(): Promise<InquiryListResponse> {
    try {
      const response = await apiClient.get<InquiryListResponse>('/inquiries/all')
      return response.data
    } catch (error: any) {
      console.error('inquiryService: Error fetching inquiries:', error)
      throw error
    }
  },

  async getInquiryById(id: string): Promise<InquiryResponse> {
    try {
      const response = await apiClient.get<InquiryResponse>(`/inquiries/${id}`)
      return response.data
    } catch (error: any) {
      console.error('inquiryService: Error fetching inquiry:', error)
      throw error
    }
  },

  async updateInquiryStatus(
    id: string,
    status: UpdateInquiryStatusRequest['status']
  ): Promise<InquiryResponse> {
    try {
      const response = await apiClient.patch<InquiryResponse>(
        `/inquiries/${id}/status`,
        { status }
      )
      return response.data
    } catch (error: any) {
      console.error('inquiryService: Error updating inquiry status:', error)
      throw error
    }
  },
}
