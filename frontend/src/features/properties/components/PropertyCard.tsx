import { forwardRef, useState } from 'react'
import { Property } from '../types'
import { Button } from '../../../components/ui'

interface PropertyCardProps {
  property: Property
  featured?: boolean
  onClick?: () => void
}

export const PropertyCard = forwardRef<HTMLDivElement, PropertyCardProps>(
  ({ property, featured = false, onClick }, ref) => {
    const [isFavourite, setIsFavourite] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const handleFavouriteClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      setIsFavourite(!isFavourite)
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

    // Generate 4 images if not provided
    const getImages = () => {
      if (property.images && property.images.length > 0) {
        return property.images.slice(0, 4)
      }
      // Generate placeholder images based on property id
      const colors = [
        ['from-gold-500', 'to-gold-400'],
        ['from-blue-500', 'to-blue-400'],
        ['from-green-500', 'to-green-400'],
        ['from-purple-500', 'to-purple-400'],
      ]
      return Array.from({ length: 4 }, (_, i) => {
        const colorIndex = (property.id + i) % colors.length
        return colors[colorIndex]
      })
    }

    const images = getImages()

    return (
      <div
        ref={ref}
        onClick={onClick}
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
          <div className="relative w-full h-full">
            {images.map((image, index) => {
              const isString = typeof image === 'string'
              const gradientClasses = isString 
                ? '' 
                : `bg-gradient-to-br ${image[0]} ${image[1]}`
              const isActive = index === currentImageIndex
              
              return (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  } ${isString ? '' : gradientClasses}`}
                >
                  {isString ? (
                    <img
                      src={image}
                      alt={`${property.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback to gradient if image fails to load
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        target.parentElement?.classList.add(`bg-gradient-to-br`, 'from-gold-500', 'to-gold-400')
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-5xl md:text-6xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                        🏠
                      </div>
                    </div>
                  )}
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
                <span>{property.area} sqm</span>
              </div>
            )}
          </div>

          {/* Location */}
          <p className="text-gray-600 text-xl flex items-start gap-2 mb-3 line-clamp-2">
            <span className="mt-0.5">📍</span>
            <span>{property.location}</span>
          </p>

          {/* Building Info */}
          {property.buildingName && (
            <p className="text-xs text-gray-500 mb-3">
              {property.buildingName}
              {property.unit && ` • Unit ${property.unit}`}
              {property.floor && ` • Floor ${property.floor}`}
            </p>
          )}

          <Button 
            variant="outline" 
            size="sm"
            className="mt-auto w-full text-sm"
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
