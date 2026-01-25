import { useCallback, useEffect, useState } from 'react'
import { Property } from '../types'
import viewHistoryService from '../services/viewHistoryService'
import { reviewService } from '../../../services/reviewService'

export const useViewHistory = () => {
  const [viewHistory, setViewHistory] = useState<Property[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchViewHistory = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await viewHistoryService.getMyViewHistory()
      
      const viewHistoryWithRatings = await Promise.all(
        data.map(async (property) => {
          try {
            const ratingResponse = await reviewService.getMedianRatingByPropertyId(String(property.id))
            return {
              ...property,
              rating: ratingResponse.data || 0,
            }
          } catch (error) {
            console.warn(`useViewHistory: Failed to fetch rating for property ${property.id}:`, error)
            return {
              ...property,
              rating: 0,
            }
          }
        })
      )
      
      setViewHistory(viewHistoryWithRatings)
    } catch (err: any) {
      console.error('useViewHistory: Error fetching view history:', err)
      setError(err?.message || 'Failed to fetch view history')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchViewHistory()
  }, [fetchViewHistory])

  const recordView = useCallback(async (propertyId: string) => {
    try {
      await viewHistoryService.recordView(propertyId)
      // Optionally refetch to update the list
      // fetchViewHistory()
    } catch (err: any) {
      console.error('useViewHistory: Error recording view:', err)
    }
  }, [])

  const removeView = useCallback(async (viewHistoryId: string) => {
    try {
      const success = await viewHistoryService.removeViewProperty(viewHistoryId)
      if (success) {
        setViewHistory((prev) =>
          prev.filter((property) => property.viewHistoryId !== viewHistoryId)
        )
      }
      return success
    } catch (err: any) {
      console.error('useViewHistory: Error removing view:', err)
      return false
    }
  }, [])

  return {
    viewHistory,
    loading,
    error,
    refetch: fetchViewHistory,
    recordView,
    removeView,
  }
}

export default useViewHistory
