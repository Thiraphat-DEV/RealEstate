import apiClient from './api'

interface ServiceResponse<T> {
  data: T | null
  length: number
  error: unknown
  statusCode: number
}

export interface PropertyMaster {
  id: string
  code: string
  name: string
}

export interface CityMaster {
  id: string
  code: string
  name: string
  province?: string
  country?: string
}

export interface LocationMaster {
  id: string
  code: string
  name: string
}

export interface AddressMaster {
  id: string
  code: string
  name: string
  district?: string
  subDistrict?: string
  city?: CityMaster
}

export const masterService = {
  async getPropertyTypes(): Promise<PropertyTypeMaster[]> {
    try {
      const response = await apiClient.get<ServiceResponse<PropertyTypeMaster[]>>(
        '/master/property-types'
      )

      return response.data.data || []
    } catch (error) {
      console.error('masterService: Error fetching property types:', error)
      return []
    }
  },

  async getCountries(): Promise<string[]> {
    try {
      const response = await apiClient.get<ServiceResponse<string[]>>(
        '/master/countries'
      )

      return response.data.data || []
    } catch (error) {
      console.error('masterService: Error fetching countries:', error)
      return []
    }
  },

  async getCities(): Promise<CityMaster[]> {
    try {
      const response = await apiClient.get<ServiceResponse<CityMaster[]>>(
        '/master/countries/cities'
      )

      return response.data.data || []
    } catch (error) {
      console.error('masterService: Error fetching cities:', error)
      return []
    }
  },

  async getBedrooms(): Promise<number[]> {
    try {
      const response = await apiClient.get<ServiceResponse<number[]>>(
        '/master/bedrooms'
      )

      return response.data.data || []
    } catch (error) {
      console.error('masterService: Error fetching bedrooms:', error)
      return []
    }
  },
}

export default masterService

