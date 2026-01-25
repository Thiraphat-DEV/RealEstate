import { useCallback, useEffect, useState } from 'react'
import { Property } from '../types'
import favouritesService from '../services/favouritesService'
import { reviewService } from '../../../services/reviewService'

export const useFavourites = () => {
  const [favourites, setFavourites] = useState<Property[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFavourites = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await favouritesService.getMyFavourites()
      
      const favouritesWithRatings = await Promise.all(
        data.map(async (property) => {
          try {
            const ratingResponse = await reviewService.getMedianRatingByPropertyId(String(property.id))
            return {
              ...property,
              rating: ratingResponse.data || 0,
            }
          } catch (error) {
            console.warn(`useFavourites: Failed to fetch rating for property ${property.id}:`, error)
            return {
              ...property,
              rating: 0,
            }
          }
        })
      )
      
      setFavourites(favouritesWithRatings)
    } catch (err: any) {
      console.error('useFavourites: Error fetching favourites:', err)
      setError(err?.message || 'Failed to fetch favourites')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFavourites()
  }, [fetchFavourites])

  const removeFromLocal = (propertyId: string) => {
    setFavourites((prev) => prev.filter((p) => p.id !== propertyId))
  }

  return {
    favourites,
    loading,
    error,
    refetch: fetchFavourites,
    removeFromLocal,
  }
}

export default useFavourites

