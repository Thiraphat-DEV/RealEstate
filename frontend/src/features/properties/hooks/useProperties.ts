import { useState, useEffect, useCallback } from 'react'
import { Property, type PropertyFilterState } from '../types'
import propertyService from '../services/propertyService'
import { authService } from '../../../services/authService'
import { reviewService } from '../../../services/reviewService'

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageLimit: 12,
    totalPages: 1,
  })
  const [currentFilters, setCurrentFilters] = useState<Partial<PropertyFilterState>>({})

  const fetchProperties = useCallback(async (filters?: Partial<PropertyFilterState>) => {
    try {
      setLoading(true)
      setError(null)
      const activeFilters = filters ?? {}
      
      const mergedFilters = {
        ...currentFilters,
        ...activeFilters,
      }
      
      const currentPage = activeFilters.page !== undefined 
        ? activeFilters.page 
        : (mergedFilters.page || pagination.page || 1)
      const currentPageLimit = activeFilters.pageLimit !== undefined 
        ? activeFilters.pageLimit 
        : (mergedFilters.pageLimit || pagination.pageLimit || 12)
      
      const filtersWithPagination = {
        ...mergedFilters,
        page: currentPage,
        pageLimit: currentPageLimit,
      }
      
      const { page, pageLimit, ...filterState } = filtersWithPagination
      setCurrentFilters(filterState)
      
      const response = await propertyService.getAllProperties(filtersWithPagination)
      
      setPagination(response.pagination)
      
      const propertiesWithRatings = await Promise.all(
        response.properties.map(async (property) => {
          try {
            const ratingResponse = await reviewService.getMedianRatingByPropertyId(property.id)
            return {
              ...property,
              rating: ratingResponse.data || 0,
            }
          } catch (error) {
            console.warn(`useProperties: Failed to fetch rating for property ${property.id}:`, error)
            return {
              ...property,
              rating: 0,
            }
          }
        })
      )
      
      await new Promise(resolve => setTimeout(resolve, 200))
      setProperties(propertiesWithRatings)
    } catch (err: any) {
      let errorMessage = 'Failed to fetch properties'
      
      if (err.response?.status === 401) {
        errorMessage = 'Unauthorized. Please login to view properties.'
      } else if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
        errorMessage = 'Backend server is not running. Please start the backend server on port 5000.'
      } else if (err.response?.status === 404) {
        errorMessage = 'Properties endpoint not found. Please check backend routes.'
      } else if (err.response?.status >= 500) {
        errorMessage = 'Backend server error. Please check backend logs.'
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
      setProperties([])
      
      await new Promise(resolve => setTimeout(resolve, 500))
    } finally {
      setLoading(false)
    }
  }, [currentFilters, pagination.page, pagination.pageLimit])

  useEffect(() => {
    fetchProperties()
  }, [])

  const handleSetFilters = useCallback((filters: PropertyFilterState | Partial<PropertyFilterState>) => {
    const { page, pageLimit, ...filterState } = filters
    fetchProperties({ ...filterState, page: 1, pageLimit: pagination.pageLimit })
  }, [fetchProperties, pagination.pageLimit])

  const handlePageChange = useCallback((page: number) => {
    fetchProperties({ page, pageLimit: pagination.pageLimit })
  }, [fetchProperties, pagination.pageLimit])

  return {
    properties,
    loading,
    error,
    pagination,
    refetch: fetchProperties,
    setFilters: handleSetFilters,
    setPage: handlePageChange,
  }
}

export default useProperties
