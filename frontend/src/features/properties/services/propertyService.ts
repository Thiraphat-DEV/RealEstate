import { Property, type PropertyFilterState } from '../types'
import { PropertyModel, mapProperty } from '../models/property.model'
import { apiClient } from '../../../services'

interface ServiceResponse<T> {
  data: T | null
  length: number
  error: unknown
  statusCode: number
  metadata?: {
    total?: number
    page?: number
    pageLimit?: number
    totalPages?: number
  }
}

export interface PropertyListResponse {
  properties: Property[]
  pagination: {
    total: number
    page: number
    pageLimit: number
    totalPages: number
  }
}

export const propertyService = {
  async getAllProperties(filters?: Partial<PropertyFilterState>): Promise<PropertyListResponse> {
    try {
      const params: Record<string, string | number | number[]> = {}

      // Send _id for master data filters (ObjectId strings) - only if not empty
      // These should be MongoDB ObjectId strings
      if (filters?.location && typeof filters.location === 'string' && filters.location.trim() !== '') {
        params.location = filters.location.trim() // City _id (ObjectId) - used in address lookup pipeline
      }
      if (filters?.address && typeof filters.address === 'string' && filters.address.trim() !== '') {
        params.address = filters.address.trim() // Address ObjectId (not keyword, but ObjectId reference)
      }
      if (filters?.propertyType && typeof filters.propertyType === 'string' && filters.propertyType.trim() !== '') {
        params.propertyType = filters.propertyType.trim() // PropertyType _id (ObjectId)
      }
      
      // Send numeric values for range filters - convert string to number
      // Backend expects numbers for these fields
      if (filters?.priceMin && typeof filters.priceMin === 'string' && filters.priceMin.trim() !== '') {
        const priceMinNum = Number(filters.priceMin.trim())
        if (!isNaN(priceMinNum)) {
          params.priceMin = priceMinNum
        }
      }
      if (filters?.priceMax && typeof filters.priceMax === 'string' && filters.priceMax.trim() !== '') {
        const priceMaxNum = Number(filters.priceMax.trim())
        if (!isNaN(priceMaxNum)) {
          params.priceMax = priceMaxNum
        }
      }
      if (filters?.bedrooms && typeof filters.bedrooms === 'string' && filters.bedrooms.trim() !== '') {
        const bedroomsNum = Number(filters.bedrooms.trim())
        if (!isNaN(bedroomsNum)) {
          params.bedrooms = bedroomsNum
        }
      }
      if (filters?.bathrooms && typeof filters.bathrooms === 'string' && filters.bathrooms.trim() !== '') {
        const bathroomsNum = Number(filters.bathrooms.trim())
        if (!isNaN(bathroomsNum)) {
          params.bathrooms = bathroomsNum
        }
      }
      if (filters?.areaMin && typeof filters.areaMin === 'string' && filters.areaMin.trim() !== '') {
        const areaMinNum = Number(filters.areaMin.trim())
        if (!isNaN(areaMinNum)) {
          params.areaMin = areaMinNum
        }
      }
      if (filters?.areaMax && typeof filters.areaMax === 'string' && filters.areaMax.trim() !== '') {
        const areaMaxNum = Number(filters.areaMax.trim())
        if (!isNaN(areaMaxNum)) {
          params.areaMax = areaMaxNum
        }
      }

      // Send search query - searches in title and location
      if (filters?.search && typeof filters.search === 'string' && filters.search.trim() !== '') {
        params.search = filters.search.trim()
      }

      const ratingArr = Array.isArray(filters?.rating)
        ? filters.rating.filter((n) => typeof n === 'number' && n >= 1 && n <= 5)
        : []
      if (ratingArr.length > 0) {
        params.rating = ratingArr
      }
      const page = filters?.page && typeof filters.page === 'number' && filters.page > 0 
        ? filters.page 
        : 1
      const pageLimit = filters?.pageLimit && typeof filters.pageLimit === 'number' && filters.pageLimit > 0
        ? filters.pageLimit
        : 12
      
      params.page = page
      params.pageLimit = pageLimit

      // Axios will automatically serialize params, but we need to ensure numbers are sent correctly
      const response = await apiClient.get<ServiceResponse<PropertyModel[]>>(
        '/properties',
        { 
          params,
          paramsSerializer: (params) => {
            const searchParams = new URLSearchParams()
            Object.entries(params).forEach(([key, value]) => {
              if (value === undefined || value === null || value === '') return
              if (Array.isArray(value)) {
                value.forEach((v) => searchParams.append(key, String(v)))
              } else {
                searchParams.append(key, String(value))
              }
            })
            return searchParams.toString()
          }
        }
      )

      const mappedBody = response.data.data || []
      const mappedProperties = mappedBody?.map(mapProperty)

      const metadata = response.data.metadata || {
        total: mappedProperties.length,
        page: 1,
        pageLimit: 20,
        totalPages: 1,
      }
      
      return {
        properties: mappedProperties,
        pagination: {
          total: metadata.total || mappedProperties.length,
          page: metadata.page || 1,
          pageLimit: metadata.pageLimit || 20,
          totalPages: metadata.totalPages || 1,
        },
      }
    } catch (error: any) {
      console.error('propertyService: Error fetching all properties:', error)
      console.error('propertyService: Error response:', error.response?.data)
      console.error('propertyService: Error status:', error.response?.status)
      throw error
    }
  },

  async getById(id: string): Promise<Property | undefined> {
    try {
      const response = await apiClient.get<ServiceResponse<PropertyModel>>(`/properties/${id}`)

      if (!response.data || !response.data.data) {
        return undefined
      }

      const mappedProperty = mapProperty(response.data.data)
      return mappedProperty
    } catch (error: any) {
      console.error('propertyService.getById: Error fetching property by ID:', error)
      console.error('propertyService.getById: Error response:', error.response?.data)
      console.error('propertyService.getById: Error status:', error.response?.status)
      throw error
    }
  },

  async getByLocation(location: string): Promise<Property[]> {
    try {
      const response = await apiClient.get<PropertyModel[]>('/properties')
      
      if (!response.data || !Array.isArray(response.data)) {
        return []
      }
      
      const allProperties = response.data.map(mapProperty)
      const lowerLocation = location.toLowerCase()
      
      return allProperties.filter(
        (p) => p.location?.toLowerCase().includes(lowerLocation) ||
               (typeof p.address === 'string' ? p.address.toLowerCase().includes(lowerLocation) : false)
      )
    } catch (error) {
      console.error('Error fetching properties by location:', error)
      throw error
    }
  },

  async search(query: string): Promise<Property[]> {
    try {
      const response = await apiClient.get<PropertyModel[]>('/properties')
      
      if (!response.data || !Array.isArray(response.data)) {
        return []
      }
      
      const allProperties = response.data.map(mapProperty)
      const lowerQuery = query.toLowerCase()
      
      return allProperties.filter(
        (p) =>
          p.title?.toLowerCase().includes(lowerQuery) ||
          p.location?.toLowerCase().includes(lowerQuery) ||
          (typeof p.address === 'string' ? p.address.toLowerCase().includes(lowerQuery) : false) ||
          p.description?.toLowerCase().includes(lowerQuery)
      )
    } catch (error) {
      console.error('Error searching properties:', error)
      throw error
    }
  },
}

export default propertyService
