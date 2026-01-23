import { useState, useEffect, useCallback } from 'react'
import { Property } from '../types'
import propertyService from '../services/propertyService'

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProperties = useCallback(async () => {
    try {
      setError(null)
      const data = await propertyService.getAll()
      setProperties(data)
    } catch (err: any) {
      console.error('Error fetching properties:', err)
      if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
        setError('Backend server is not running. Please start the backend server.')
      } else {
        setError('Failed to fetch properties')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  return {
    properties,
    loading,
    error,
    refetch: fetchProperties,
  }
}

export default useProperties
