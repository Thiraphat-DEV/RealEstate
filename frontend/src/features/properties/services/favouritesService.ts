import { apiClient } from '../../../services'
import { Property } from '../types'
import { PropertyModel, mapProperty } from '../models/property.model'

interface ServiceResponse<T> {
  data: T | null
  length: number
  error: unknown
  statusCode: number
}

export const favouritesService = {
  async getMyFavourites(): Promise<Property[]> {
    try {
      const response = await apiClient.get<ServiceResponse<PropertyModel[]>>(
        '/favourites'
      )

      const body = response.data

      if (!body || !Array.isArray(body.data)) {
        console.warn(
          'favouritesService: Invalid favourites response shape:',
          body
        )
        return []
      }

      return body.data.map(mapProperty)
    } catch (error) {
      console.error('favouritesService: Error fetching favourites:', error)
      return []
    }
  },

  async toggleFavourite(propertyId: string): Promise<boolean> {
    try {
      const response = await apiClient.post<
        ServiceResponse<{ isFavourite: boolean }>
      >('/favourites/toggle', { propertyId })

      const body = response.data
      return !!body?.data?.isFavourite
    } catch (error) {
      console.error('favouritesService: Error toggling favourite:', error)
      throw error
    }
  },

  async isFavourite(propertyId: string): Promise<boolean> {
    try {
      const response = await apiClient.get<
        ServiceResponse<{ isFavourite: boolean }>
      >('/favourites/status', {
        params: { propertyId },
      })

      const body = response.data
      return !!body?.data?.isFavourite
    } catch (error) {
      console.error('favouritesService: Error checking favourite status:', error)
      return false
    }
  },
}

export default favouritesService

