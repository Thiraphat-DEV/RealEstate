import { apiClient } from '../../../services'
import { Property } from '../types'
import { PropertyModel, mapProperty } from '../models/property.model'

interface ServiceResponse<T> {
  data: T | null
  length: number
  error: unknown
  statusCode: number
}

export const viewHistoryService = {
  async recordView(propertyId: string): Promise<boolean> {
    try {
      const response = await apiClient.post<
        ServiceResponse<{ recorded: boolean }>
      >('/view-history/record', { propertyId })

      const body = response.data
      return !!body?.data?.recorded
    } catch (error) {
      console.error('viewHistoryService: Error recording view:', error)
      return false
    }
  },

  async getMyViewHistory(): Promise<Property[]> {
    try {
      const response = await apiClient.get<ServiceResponse<PropertyModel[]>>(
        '/view-history'
      )

      const body = response.data

      if (!body || !Array.isArray(body.data)) {
        console.warn(
          'viewHistoryService: Invalid view history response shape:',
          body
        )
        return []
      }

      return body.data.map(mapProperty)
    } catch (error) {
      console.error('viewHistoryService: Error fetching view history:', error)
      return []
    }
  },

  async removeViewProperty(viewHistoryId: string): Promise<boolean> {
    try {
      const response = await apiClient.patch<
        ServiceResponse<{ removed: boolean }>
      >('/view-history/remove', { viewHistoryId })

      const body = response.data
      return !!body?.data?.removed
    } catch (error) {
      console.error('viewHistoryService: Error removing view:', error)
      return false
    }
  },
}

export default viewHistoryService
