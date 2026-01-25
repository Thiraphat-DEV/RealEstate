import { useState, useEffect } from 'react'
import { Property } from '../types'
import propertyService from '../services/propertyService'

export const useProperty = (id: string | undefined) => {
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError('Property ID is required')
      setLoading(false)
      return
    }

    const fetchProperty = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await propertyService.getById(id)
        
        if (data) {
          setProperty(data)
        } else {
          setError('Property not found')
        }
      } catch (err: any) {
        console.error('useProperty: Error fetching property:', err)
        let errorMessage = 'Failed to fetch property'
        
        if (err.response?.status === 404) {
          errorMessage = 'Property not found'
        } else if (err.response?.status === 401) {
          errorMessage = 'Unauthorized. Please login to view property details.'
        } else if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
          errorMessage = 'Backend server is not running. Please start the backend server on port 5000.'
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message
        } else if (err.message) {
          errorMessage = err.message
        }
        
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [id])

  return {
    property,
    loading,
    error,
  }
}

export default useProperty
