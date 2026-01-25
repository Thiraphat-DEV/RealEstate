import { useParams, useNavigate } from 'react-router-dom'
import { Header, Footer } from '../components/layout'
import { Spinner, Button } from '../components/ui'
import { ContactAgent } from '../components/contactAgent'
import { useProperty } from '../features/properties/hooks/useProperty'
import favouritesService from '../features/properties/services/favouritesService'
import viewHistoryService from '../features/properties/services/viewHistoryService'
import { reviewService, type Review, type RatingData } from '../services/reviewService'
import { useAuth } from '../features/auth/context/AuthContext'
import { useState, useEffect } from 'react'

export const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { property, loading, error } = useProperty(id)
  const { isAuthenticated } = useAuth()
  const [isFavourite, setIsFavourite] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [checkingFavourite, setCheckingFavourite] = useState(true)
  const [reviews, setReviews] = useState<Review[]>([])
  const [ratingData, setRatingData] = useState<RatingData | null>(null)
  const [loadingReviews, setLoadingReviews] = useState(true)

  // Check if property is favourite
  useEffect(() => {
    const checkFavourite = async () => {
      if (!id) return
      if (!isAuthenticated) {
        setIsFavourite(false)
        setCheckingFavourite(false)
        return
      }
      try {
        const favourite = await favouritesService.isFavourite(id)
        setIsFavourite(favourite)
      } catch (error) {
        console.error('Error checking favourite status:', error)
      } finally {
        setCheckingFavourite(false)
      }
    }
    checkFavourite()
  }, [id, isAuthenticated])

  // Record view history when property is loaded and user is authenticated
  useEffect(() => {
    const recordViewHistory = async () => {
      if (!id || !isAuthenticated || !property) return
      try {
        await viewHistoryService.recordView(id)
      } catch (error) {
        console.error('Error recording view history:', error)
        // Don't show error to user, view history is not critical
      }
    }
    recordViewHistory()
  }, [id, isAuthenticated, property])

  // Fetch reviews and rating data
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return
      try {
        setLoadingReviews(true)
        const [reviewsResponse, ratingResponse, medianResponse] = await Promise.all([
          reviewService.getReviewsByPropertyId(id),
          reviewService.getRatingDataByPropertyId(id),
          reviewService.getMedianRatingByPropertyId(id),
        ])
        setReviews(reviewsResponse.data || [])
        const ratingDataWithMedian = ratingResponse.data || null
        if (ratingDataWithMedian) {
          ratingDataWithMedian.medianRating = medianResponse.data || 0
        }
        setRatingData(ratingDataWithMedian)
      } catch (error) {
        console.error('Error fetching reviews:', error)
        setReviews([])
        setRatingData(null)
      } finally {
        setLoadingReviews(false)
      }
    }
    fetchReviews()
  }, [id])

  const handleFavouriteToggle = async () => {
    if (!id) return
    
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    const previous = isFavourite
    setIsFavourite(!previous)

    try {
      const serverIsFavourite = await favouritesService.toggleFavourite(id)
      setIsFavourite(serverIsFavourite)
    } catch (error: any) {
      console.error('Failed to toggle favourite', error)
      setIsFavourite(previous)
      
      if (error?.response?.status === 401) {
        navigate('/login')
      }
    }
  }

  const handlePrevImage = () => {
    if (!property?.images || property.images.length === 0) return
    <Spinner size="lg" />
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images!.length - 1 : prev - 1
    )
  }

  const handleNextImage = () => {
    if (!property?.images || property.images.length === 0) return
    <Spinner size="lg" />
    setCurrentImageIndex((prev) =>
      prev === property.images!.length - 1 ? 0 : prev + 1
    )
  }

  const handleNextProperty = async () => {
    if (!property?.nextPropertyID) return
    // Record view history before navigating
    if (isAuthenticated && property.nextPropertyID) {
      try {
        await viewHistoryService.recordView(property.nextPropertyID)
      } catch (error) {
        console.error('Error recording view history:', error)
      }
    }
    <Spinner size="lg" />
    navigate(`/properties/${property.nextPropertyID}`)
  }

  const handleBackProperty = async () => {
    // Record view history for current property before navigating back
    if (isAuthenticated && id) {
      try {
        await viewHistoryService.recordView(id)
      } catch (error) {
        console.error('Error recording view history:', error)
      }
    }
    <Spinner size="lg" />
    navigate(-1)
  }

  // Generate placeholder images if needed
  const getImages = () => {
    if (property?.images && property.images.length > 0) {
      return property.images
    }
    const colors = [
      ['from-gold-500', 'to-gold-400'],
      ['from-blue-500', 'to-blue-400'],
      ['from-green-500', 'to-green-400'],
      ['from-purple-500', 'to-purple-400'],
    ]
    return Array.from({ length: 4 }, (_, i) => {
      const colorIndex = (property?.id ? String(property.id).charCodeAt(0) + i : i) % colors.length
      return colors[colorIndex]
    })
  }

  const images = property ? getImages() : []

  // Only show full page loading on initial load (when there's no property yet)
  if ((loading || checkingFavourite) && !property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center py-32 text-gray-600 text-xl gap-4">
          <Spinner size="lg" />
          <p>Loading property details...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (error && !property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-32 px-8">
          <div className="bg-white rounded-2xl border-2 border-red-300 max-w-2xl mx-auto my-8 shadow-lg p-8">
            <p className="text-2xl mb-4 text-red-600 font-semibold">
              ⚠️ {error || 'Property not found'}
            </p>
            <Button
              onClick={() => navigate('/')}
              className="mt-4"
            >
              Back to Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-32 px-8">
          <div className="bg-white rounded-2xl border-2 border-red-300 max-w-2xl mx-auto my-8 shadow-lg p-8">
            <p className="text-2xl mb-4 text-red-600 font-semibold">
              ⚠️ Property not found
            </p>
            <Button
              onClick={() => navigate('/')}
              className="mt-4"
            >
              Back to Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main key={id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Buttons */}
        <div className="mb-6 flex items-center justify-between">

          <button onClick={handleBackProperty} className="flex items-center gap-2 px-4 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition-colors font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Property</span>
          </button>

          {property.nextPropertyID ? (
            <button
              onClick={handleNextProperty}
              className="flex items-center gap-2 px-4 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition-colors font-medium"
            >
              <span>Next to Property</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : null}

        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden relative">
          {/* Loading Overlay - Only for property content */}
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50 rounded-xl">
                <Spinner size="lg" />
            </div>
          )}
          {/* Image Gallery Section */}
          <div className="relative w-full h-96 md:h-[500px] lg:h-[600px] bg-gray-200">
            {images.map((image, index) => {
              const isString = typeof image === 'string'
              const gradientClasses = isString
                ? ''
                : `bg-gradient-to-br ${image[0]} ${image[1]}`
              const isActive = index === currentImageIndex

              return (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-500 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    } ${isString ? '' : gradientClasses}`}
                >
                  {isString ? (
                    <img
                      src={image}
                      alt={`${property.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        target.parentElement?.classList.add('bg-gradient-to-br', 'from-gold-500', 'to-gold-400')
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-8xl opacity-80">
                        🏠
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-20"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-20"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Image Indicator Dots */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`transition-all rounded-full ${index === currentImageIndex
                        ? 'bg-white w-8 h-2'
                        : 'bg-white/50 w-2 h-2 hover:bg-white/75'
                      }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Favourite Button */}
            <button
              onClick={handleFavouriteToggle}
              className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 z-20 shadow-lg ${isFavourite
                  ? 'bg-red-500 text-white scale-110'
                  : 'bg-white/90 text-gray-400 hover:bg-white hover:text-amber-500'
                }`}
              aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
            >
              <svg
                className={`w-7 h-7 transition-all duration-300 ${isFavourite ? 'fill-current' : 'fill-none stroke-current stroke-2'
                  }`}
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-8">
            {/* Title and Price */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {property.title}
              </h1>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <p className="text-3xl md:text-4xl font-bold text-gold-600">
                  ฿{property.price.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Property Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-6 bg-gray-50 rounded-lg justify-items-center">
              {property.bedrooms !== undefined && (
                <div className="text-center">
                  <div className="text-3xl mb-2">🛏️</div>
                  <div className="text-sm text-gray-600">ห้องนอน</div>
                  <div className="text-xl font-semibold text-gray-900">{property.bedrooms}</div>
                </div>
              )}
              {property.bathrooms !== undefined && (
                <div className="text-center">
                  <div className="text-3xl mb-2">🚿</div>
                  <div className="text-sm text-gray-600">ห้องน้ำ</div>
                  <div className="text-xl font-semibold text-gray-900">{property.bathrooms}</div>
                </div>
              )}
              {property.area && (
                <div className="text-center">
                  <div className="text-3xl mb-2">📐</div>
                  <div className="text-sm text-gray-600">พื้นที่</div>
                  <div className="text-xl font-semibold text-gray-900">
                    {property.area} ตารางเมตร
                  </div>
                </div>
              )}
            </div>

            {/* Additional Property Information */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Property ID */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl mt-1">🆔</span>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Property Name</div>
                  <div className="text-base font-medium text-gray-900 font-mono">{property?.title}</div>
                </div>
              </div>

              {/* Price per ตารางเมตร */}
              {property.area && property.area > 0 && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <span className="text-2xl mt-1">💰</span>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-1">ราคาต่อตารางเมตร</div>
                    <div className="text-base font-medium text-gray-900">
                      ฿{Math.round(property.price / property.area).toLocaleString()}/ตารางเมตร
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Location and Address */}
            <div className="mb-8 space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-1">📍</span>
                <div>
                  <div className="text-sm text-gray-500 mb-1">สถานที่</div>
                  <div className="text-lg font-medium text-gray-900">{property.location}</div>
                </div>
              </div>
              {(() => {
                const addressData = (property as any).address;
                if (!addressData) return null;

                // Build address string from address fields
                const addressParts: string[] = [];
                if (addressData.address) addressParts.push(addressData.address);
                if (addressData.district) addressParts.push(addressData.district);
                if (addressData.subDistrict) addressParts.push(addressData.subDistrict);
                if (addressData.city?.name) addressParts.push(addressData.city.name);
                if (addressData.postalCode) addressParts.push(addressData.postalCode);

                const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : null;

                return fullAddress ? (
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-1">🏠</span>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Address</div>
                      <div className="text-lg font-medium text-gray-900">{fullAddress}</div>
                    </div>
                  </div>
                ) : null;
              })()}
              {property.buildingName && (
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-1">🏢</span>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Building</div>
                    <div className="text-lg font-medium text-gray-900">
                      {property.buildingName}
                      {property.unit && ` • Unit ${property.unit}`}
                      {property.floor && ` • Floor ${property.floor}`}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Description Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {property.description || 'No description available for this property.'}
                </p>
              </div>
            </div>

            {/* Property Features Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Property Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-xl">🏘️</span>
                  <div>
                    <div className="text-sm text-gray-500">ประเภท</div>
                    <div className="text-base font-medium text-gray-900">
                      {(property as any).propertyTypeName || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-xl">📊</span>
                  <div>
                    <div className="text-sm text-gray-500">Status</div>
                    <div className="text-base font-medium text-gray-900">
                      {(property as any).statusName || 'Available'}
                    </div>
                  </div>
                </div>
                {property.locationData && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-xl">🌍</span>
                    <div>
                      <div className="text-sm text-gray-500">Province</div>
                      <div className="text-base font-medium text-gray-900">
                        {property.locationData.province || 'N/A'}
                      </div>
                    </div>
                  </div>
                )}
                {(property as any).createdAt && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-xl">📅</span>
                    <div>
                      <div className="text-sm text-gray-500">Listed Date</div>
                      <div className="text-base font-medium text-gray-900">
                        {new Date((property as any).createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Rating and Reviews Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ratings & Reviews</h2>

              {loadingReviews ? (
                <div className="flex items-center justify-center py-8">
                  <Spinner size="md" />
                </div>
              ) : ratingData && ratingData.totalReviews > 0 ? (
                <>
                  {/* Rating Summary */}
                  <div className="mb-6 p-6 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-6 mb-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gold-600">
                          {ratingData.medianRating?.toFixed(1) || ratingData.averageRating.toFixed(1)}
                        </div>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const displayRating = ratingData.medianRating || ratingData.averageRating
                            return (
                              <svg
                                key={star}
                                className={`w-5 h-5 ${star <= Math.round(displayRating)
                                    ? 'text-amber-400 fill-current'
                                    : 'text-gray-300'
                                  }`}
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                              </svg>
                            )
                          })}
                        </div>
                        <div className="text-sm text-gray-600 mt-2">
                          จาก {ratingData.totalReviews} รีวิว
                        </div>
                      </div>

                      {/* Rating Distribution */}
                      <div className="flex-1">
                        {[5, 4, 3, 2, 1].map((rating) => {
                          const count = ratingData.ratingDistribution[rating as keyof typeof ratingData.ratingDistribution]
                          const percentage = ratingData.totalReviews > 0
                            ? (count / ratingData.totalReviews) * 100
                            : 0
                          return (
                            <div key={rating} className="flex items-center gap-2 mb-2">
                              <span className="text-sm text-gray-600 w-8">{rating} ⭐</span>
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-amber-400 transition-all"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 w-12 text-right">
                                {count}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      รีวิวล่าสุด ({reviews.length})
                    </h3>
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div key={review._id} className="p-4 bg-white border border-gray-200 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center">
                                <span className="text-gold-600 font-semibold">
                                  {review.userName.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{review.userName}</div>
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                      key={star}
                                      className={`w-4 h-4 ${star <= review.rating
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
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString('th-TH', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                          {review.comment && (
                            <p className="text-gray-700 mt-3 leading-relaxed">
                              {review.comment}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">ยังไม่มีรีวิว</p>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">ยังไม่มีคะแนนและรีวิว</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-gray-200">
              <ContactAgent
                propertyTitle={property.title}
                propertyId={String(property.id)}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default PropertyDetailPage
