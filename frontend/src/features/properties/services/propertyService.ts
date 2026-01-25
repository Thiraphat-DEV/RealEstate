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
      const params: Record<string, string | number> = {}

      // Send _id for master data filters (ObjectId strings) - only if not empty
      // These should be MongoDB ObjectId strings
      if (filters?.location && typeof filters.location === 'string' && filters.location.trim() !== '') {
        params.location = filters.location.trim() // City _id (ObjectId) - used in address lookup pipeline
        console.log('propertyService: Adding location filter (ObjectId):', params.location)
      }
      if (filters?.address && typeof filters.address === 'string' && filters.address.trim() !== '') {
        params.address = filters.address.trim() // Address ObjectId (not keyword, but ObjectId reference)
        console.log('propertyService: Adding address filter (ObjectId):', params.address)
      }
      if (filters?.propertyType && typeof filters.propertyType === 'string' && filters.propertyType.trim() !== '') {
        params.propertyType = filters.propertyType.trim() // PropertyType _id (ObjectId)
        console.log('propertyService: Adding propertyType filter (ObjectId):', params.propertyType)
      }
      
      // Send numeric values for range filters - convert string to number
      // Backend expects numbers for these fields
      if (filters?.priceMin && typeof filters.priceMin === 'string' && filters.priceMin.trim() !== '') {
        const priceMinNum = Number(filters.priceMin.trim())
        if (!isNaN(priceMinNum)) {
          params.priceMin = priceMinNum
          console.log('propertyService: Adding priceMin filter (number):', params.priceMin)
        }
      }
      if (filters?.priceMax && typeof filters.priceMax === 'string' && filters.priceMax.trim() !== '') {
        const priceMaxNum = Number(filters.priceMax.trim())
        if (!isNaN(priceMaxNum)) {
          params.priceMax = priceMaxNum
          console.log('propertyService: Adding priceMax filter (number):', params.priceMax)
        }
      }
      if (filters?.bedrooms && typeof filters.bedrooms === 'string' && filters.bedrooms.trim() !== '') {
        const bedroomsNum = Number(filters.bedrooms.trim())
        if (!isNaN(bedroomsNum)) {
          params.bedrooms = bedroomsNum
          console.log('propertyService: Adding bedrooms filter (number):', params.bedrooms)
        }
      }
      if (filters?.bathrooms && typeof filters.bathrooms === 'string' && filters.bathrooms.trim() !== '') {
        const bathroomsNum = Number(filters.bathrooms.trim())
        if (!isNaN(bathroomsNum)) {
          params.bathrooms = bathroomsNum
          console.log('propertyService: Adding bathrooms filter (number):', params.bathrooms)
        }
      }
      if (filters?.areaMin && typeof filters.areaMin === 'string' && filters.areaMin.trim() !== '') {
        const areaMinNum = Number(filters.areaMin.trim())
        if (!isNaN(areaMinNum)) {
          params.areaMin = areaMinNum
          console.log('propertyService: Adding areaMin filter (number):', params.areaMin)
        }
      }
      if (filters?.areaMax && typeof filters.areaMax === 'string' && filters.areaMax.trim() !== '') {
        const areaMaxNum = Number(filters.areaMax.trim())
        if (!isNaN(areaMaxNum)) {
          params.areaMax = areaMaxNum
          console.log('propertyService: Adding areaMax filter (number):', params.areaMax)
        }
      }

      // Send search query - searches in title and location
      if (filters?.search && typeof filters.search === 'string' && filters.search.trim() !== '') {
        params.search = filters.search.trim()
        console.log('propertyService: Adding search filter:', params.search)
      }

      // Add pagination parameters - always send them
      const page = filters?.page && typeof filters.page === 'number' && filters.page > 0 
        ? filters.page 
        : 1
      const pageLimit = filters?.pageLimit && typeof filters.pageLimit === 'number' && filters.pageLimit > 0
        ? filters.pageLimit
        : 12
      
      params.page = page
      params.pageLimit = pageLimit
      
      console.log('propertyService: Adding pagination:', { page, pageLimit })

      console.log('=== propertyService: Final API Request ===')
      console.log('Full params object:', params)
      console.log('Number of active filters:', Object.keys(params).length)
      console.log('Filter values being sent:', {
        location: filters?.location || '(empty)',
        propertyType: filters?.propertyType || '(empty)',
        address: filters?.address || '(empty)',
        priceMin: filters?.priceMin || '(empty)',
        priceMax: filters?.priceMax || '(empty)',
        bedrooms: filters?.bedrooms || '(empty)',
        bathrooms: filters?.bathrooms || '(empty)',
        areaMin: filters?.areaMin || '(empty)',
        areaMax: filters?.areaMax || '(empty)',
        search: filters?.search || '(empty)',
        page: params.page || '(empty)',
        pageLimit: params.pageLimit || '(empty)',
      })
      // Build query string for logging
      const queryString = Object.keys(params).length > 0 
        ? '?' + new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => {
              acc[key] = String(value)
              return acc
            }, {} as Record<string, string>)
          ).toString()
        : ''
      console.log('Full API URL: /properties' + queryString)
      console.log('Params being sent to axios:', params)
      
      // Axios will automatically serialize params, but we need to ensure numbers are sent correctly
      const response = await apiClient.get<ServiceResponse<PropertyModel[]>>(
        '/properties',
        { 
          params,
          paramsSerializer: (params) => {
            const searchParams = new URLSearchParams()
            Object.entries(params).forEach(([key, value]) => {
              if (value !== undefined && value !== null && value !== '') {
                searchParams.append(key, String(value))
              }
            })
            return searchParams.toString()
          }
        }
      )
      
      console.log('=== propertyService: API Response ===')
      console.log('Response status:', response.status)
      console.log('Response data structure:', {
        hasData: !!response.data,
        hasDataData: !!response.data?.data,
        dataLength: response.data?.data?.length || 0,
        statusCode: response.data?.statusCode,
      })
      
      const mappedBody = response.data.data || []
      console.log('propertyService: Mapping', mappedBody.length, 'properties')
      const mappedProperties = mappedBody?.map(mapProperty)
      
      console.log('propertyService: Mapped properties:', mappedBody)
      console.log('propertyService: Metadata:', response.data.metadata)
      
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
      console.log('propertyService.getById: Fetching property with ID:', id)
      // Send id as path parameter to match backend @Param('id') decorator
      const response = await apiClient.get<ServiceResponse<PropertyModel>>(`/properties/${id}`)
      console.log('propertyService.getById: Response received:', response.data)
      
      if (!response.data || !response.data.data) {
        console.warn('propertyService.getById: No data in response')
        return undefined
      }
      
      const mappedProperty = mapProperty(response.data.data)
      console.log('propertyService.getById: Mapped property:', mappedProperty)
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
               p.address?.toLowerCase().includes(lowerLocation)
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
          p.address?.toLowerCase().includes(lowerQuery) ||
          p.description?.toLowerCase().includes(lowerQuery)
      )
    } catch (error) {
      console.error('Error searching properties:', error)
      throw error
    }
  },
}

export default propertyService
