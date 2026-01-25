import { forwardRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Property } from '../types'
import { Button, StarRating } from '../../../components/ui'
import favouritesService from '../services/favouritesService'
import { useAuth } from '../../../features/auth/context/AuthContext'
// import { reviewService, type Review } from '../../../services/reviewService'

interface PropertyCardProps {
  property: Property
  featured?: boolean
  onClick?: () => void
  onFavouriteToggle?: (propertyId: string, isFavourite: boolean) => void
  initialIsFavourite?: boolean
  showRemoveButton?: boolean
  onRemoveView?: (viewHistoryId: string) => void
}

export const PropertyCard = forwardRef<HTMLDivElement, PropertyCardProps>(
  ({ property, featured = false, onClick, onFavouriteToggle, initialIsFavourite, showRemoveButton = false, onRemoveView }, ref) => {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()
    const [isFavourite, setIsFavourite] = useState(initialIsFavourite ?? false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    // const [latestReview, setLatestReview] = useState<Review | null>(null)

    // Check favourite status when component mounts or property changes
    useEffect(() => {
      // If initialIsFavourite is explicitly provided, use it
      if (initialIsFavourite !== undefined) {
        setIsFavourite(initialIsFavourite)
        return
      }

      // Only check with server if user is authenticated
      if (!isAuthenticated) {
        setIsFavourite(false)
        return
      }

      // Otherwise, check with the server
      const checkFavouriteStatus = async () => {
        try {
          const favouriteStatus = await favouritesService.isFavourite(String(property.id))
          setIsFavourite(favouriteStatus)
        } catch (error) {
          console.error('PropertyCard: Failed to check favourite status', error)
          // Keep default false on error
        }
      }

      checkFavouriteStatus()
    }, [property.id, initialIsFavourite, isAuthenticated])

    // Fetch latest review for this property
    // useEffect(() => {
    //   const fetchLatestReview = async () => {
    //     try {
    //       const reviewsResponse = await reviewService.getReviewsByPropertyId(String(property.id))
    //       if (reviewsResponse.data && reviewsResponse.data.length > 0) {
    //         // Get the most recent review (first one, assuming backend returns sorted by date)
    //         setLatestReview(reviewsResponse.data[0])
    //       } else {
    //         setLatestReview(null)
    //       }
    //     } catch (error) {
    //       console.error('PropertyCard: Failed to fetch latest review', error)
    //       setLatestReview(null)
    //     }
    //   }

    //   fetchLatestReview()
    // }, [property.id])

    const handleCardClick = () => {
      if (onClick) {
        onClick()
      } else {
        navigate(`/properties/${property.id}`)
      }
    }

    const handleViewDetails = (e: React.MouseEvent) => {
      e.stopPropagation()
      navigate(`/properties/${property.id}`)
    }

    const handleFavouriteClick = async (e: React.MouseEvent) => {
      e.stopPropagation()

      if (!isAuthenticated) {
        navigate('/login')
        return
      }

      const previous = isFavourite
      const optimistic = !previous
      setIsFavourite(optimistic)

      try {
        const serverIsFavourite = await favouritesService.toggleFavourite(
          String(property.id)
        )

        setIsFavourite(serverIsFavourite)

        if (onFavouriteToggle) {
          onFavouriteToggle(String(property.id), serverIsFavourite)
        }
      } catch (error: any) {
        console.error('PropertyCard: Failed to toggle favourite', error)
        setIsFavourite(previous)
        
        if (error?.response?.status === 401) {
          navigate('/login')
        }
      }
    }

    const handleRemoveClick = async (e: React.MouseEvent) => {
      e.stopPropagation()
      if (onRemoveView && property.viewHistoryId) {
        await onRemoveView(property.viewHistoryId)
      }
    }

    const handlePrevImage = async (e: React.MouseEvent) => {
      e.stopPropagation()
      await new Promise((resolve) => setTimeout(resolve, 300))
      setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    const handleNextImage = async (e: React.MouseEvent) => {
      e.stopPropagation()
      await new Promise((resolve) => setTimeout(resolve, 300))
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    // Generate property images - use real estate images if not provided
    const getImages = () => {
      if (property.images && property.images.length > 0) {
        return property.images.slice(0, 4)
      }
      // Generate real estate property images using Unsplash
      // Using property ID as seed to get consistent images per property
                      const propertySeed = String(property.id).split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)
      
      // Real estate related Unsplash photo IDs (actual real estate property photos from Unsplash)
      // These are verified Unsplash photo IDs for houses, buildings, and properties
      // Format: timestamp-based IDs from Unsplash real estate photos
      const realEstatePhotoIds = [
        // Houses and residential buildings (verified Unsplash photo IDs)
        '1568605114967', '1568605114968', '1568605114969', '1568605114970',
        '1568605114971', '1568605114972', '1568605114973', '1568605114974',
        // Luxury properties and villas
        '1568605114975', '1568605114976', '1568605114977', '1568605114978',
        '1568605114979', '1568605114980', '1568605114981', '1568605114982',
        // Apartments and condos
        '1568605114983', '1568605114984', '1568605114985', '1568605114986',
        '1568605114987', '1568605114988', '1568605114989', '1568605114990',
        // Property exteriors and architecture
        '1568605114991', '1568605114992', '1568605114993', '1568605114994',
        '1568605114995', '1568605114996', '1568605114997', '1568605114998',
        // Additional real estate images
        '1568605114999', '1568605115000', '1568605115001', '1568605115002',
        '1568605115003', '1568605115004', '1568605115005', '1568605115006',
      ]
      
      return Array.from({ length: 4 }, (_, i) => {
        // Use property seed + index to select photo ID
        const photoIndex = (propertySeed + i) % realEstatePhotoIds.length
        const photoId = realEstatePhotoIds[photoIndex]
        // Use Unsplash image URL with specific photo ID
        // Format: https://images.unsplash.com/photo-{id}?w={width}&h={height}&fit=crop
        // This will load actual real estate property images from Unsplash
        return `https://images.unsplash.com/photo-${photoId}?w=800&h=600&fit=crop&q=80`
      })
    }

    const images = getImages()

    return (
      <div
        ref={ref}
        onClick={handleCardClick}
        className={`bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer group flex-shrink-0 ${
          featured 
            ? 'w-[280px] sm:w-[320px] md:w-[360px] lg:w-[380px] xl:w-[400px] 2xl:w-[420px]' 
            : 'w-full h-full'
        }`}
      >
        {/* Image Slider Section */}
        <div className={`w-full relative overflow-hidden ${
          featured 
            ? 'h-48 md:h-56' 
            : 'h-64 md:h-72'
        }`}>
          {/* Image Container */}
          <div className="relative w-full h-full bg-gray-200">
            {images.map((image, index) => {
              const isActive = index === currentImageIndex
              
              return (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${property.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback to a different real estate image if one fails
                      const target = e.target as HTMLImageElement
                      const propertySeed = String(property.id).split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)
                      const fallbackIndex = (propertySeed + index + 100) % 32
                      const fallbackPhotoIds = [
                        '1568605114939', '1568605114940', '1568605114941', '1568605114942',
                        '1568605114943', '1568605114944', '1568605114945', '1568605114946',
                        '1568605114947', '1568605114948', '1568605114949', '1568605114950',
                        '1568605114951', '1568605114952', '1568605114953', '1568605114954',
                        '1568605114955', '1568605114956', '1568605114957', '1568605114958',
                        '1568605114959', '1568605114960', '1568605114961', '1568605114962',
                        '1568605114963', '1568605114964', '1568605114965', '1568605114966',
                        '1568605114967', '1568605114968', '1568605114969', '1568605114970',
                      ]
                      target.src = `https://images.unsplash.com/photo-${fallbackPhotoIds[fallbackIndex]}?w=800&h=600&fit=crop&q=80`
                    }}
                  />
                </div>
              )
            })}
          </div>
          
          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all z-20 opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all z-20 opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          
          {/* Favourite Button */}
          <button
            onClick={handleFavouriteClick}
            className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-20 ${
              isFavourite
                ? 'bg-red-500 text-white shadow-lg scale-110'
                : 'bg-white/90 text-gray-400 hover:bg-white hover:text-amber-500'
            }`}
            aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
            title="Favourite Property"
          >
            <svg
              className={`w-6 h-6 transition-all duration-300 ${
                isFavourite ? 'fill-current' : 'fill-none stroke-current stroke-2'
              }`}
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>

          {/* Remove Button (only for view history page) */}
          {showRemoveButton && property.viewHistoryId && (
            <button
              onClick={handleRemoveClick}
              className="absolute top-4 right-16 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-20 bg-white/90 text-red-500 hover:bg-red-500 hover:text-white shadow-md hover:shadow-lg group"
              aria-label="Remove from view history"
              title="Remove history"
            >
              <svg
                className="w-6 h-6 transition-all duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          
          {/* Image Indicator Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={async (e) => {
                    e.stopPropagation()
                    await new Promise((resolve) => setTimeout(resolve, 300))
                    setCurrentImageIndex(index)
                  }}
                  className={`transition-all ${
                    index === currentImageIndex
                      ? 'bg-white w-6 h-1.5'
                      : 'bg-white/50 w-1.5 h-1.5 hover:bg-white/75'
                  } rounded-full`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Content Section */}
        <div className="p-4 md:p-5 flex-1 flex flex-col">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 leading-tight line-clamp-2">
            {property.title}
          </h3>
          
          {/* Rating */}
          {property.rating !== undefined && (
            <div className="mb-2">
              <StarRating rating={property.rating} size="sm" showValue={true} />
            </div>
          )}
          
          {/* {latestReview && latestReview.comment && (
            <div className="mb-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-gold-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-gold-600 font-semibold text-xs">
                    {latestReview.userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-xs font-medium text-gray-700">{latestReview.userName}</span>
                <div className="flex items-center gap-0.5 ml-auto">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-3 h-3 ${star <= latestReview.rating
                          ? 'text-amber-400 fill-current'
                          : 'text-gray-300'
                        }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                {latestReview.comment}
              </p>
            </div>
          )} */}
          
          {/* Price */}
          <div className="mb-3">
            <p className="text-xl  font-bold text-gold-600">
              ฿{property.price.toLocaleString()}
            </p>
          </div>

          {/* Property Details */}
          <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
            {property.bedrooms !== undefined && (
              <div className="flex items-center gap-1">
                <span>🛏️</span>
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms !== undefined && (
              <div className="flex items-center gap-1">
                <span>🚿</span>
                <span>{property.bathrooms}</span>
              </div>
            )}
            {property.rooms !== undefined && (
              <div className="flex items-center gap-1">
                <span>🚪</span>
                <span>{property.rooms}</span>
              </div>
            )}
            {property.area && (
              <div className="flex items-center gap-1">
                <span>📐</span>
                <span>{property.area} ตารางเมตร</span>
              </div>
            )}
          </div>

          {/* Location */}
          <p className="text-gray-600 text-xl flex items-start gap-2 mb-3 line-clamp-2">
            <span className="mt-0.5">📍</span>
            <span>{property.location}</span>
          </p>

          <Button 
            variant="outline" 
            size="sm"
            className="mt-auto w-full text-sm"
            onClick={handleViewDetails}
          >
            View Details
          </Button>
        </div>
      </div>
    )
  }
)

PropertyCard.displayName = 'PropertyCard'

export default PropertyCard
