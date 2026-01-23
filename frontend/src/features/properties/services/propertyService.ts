import apiClient from '../../../services/api'
import { Property } from '../types'
import { propertyMockService } from '../../../services/propertyMockService'

export const propertyService = {
  getAll: async (): Promise<Property[]> => {
    return propertyMockService.getAll()
  },

  getById: async (id: number): Promise<Property> => {
    const response = await apiClient.get<Property>(`/properties/${id}`)
    return response.data
  },

  create: async (property: Omit<Property, 'id'>): Promise<Property> => {
    const response = await apiClient.post<Property>('/properties', property)
    return response.data
  },
}

export default propertyService
