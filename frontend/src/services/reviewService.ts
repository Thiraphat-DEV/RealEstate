import apiClient from './api'

export interface Review {
  _id: string
  propertyId: string
  userId: string
  userName: string
  rating: number
  comment?: string
  createdAt: string
  updatedAt: string
}

export interface RatingData {
  averageRating: number
  medianRating: number
  totalReviews: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

export interface CreateReviewRequest {
  propertyId: string
  rating: number
  comment?: string
}

export interface ReviewsResponse {
  data: Review[]
  length: number
  error: null
  statusCode: number
}

export interface RatingDataResponse {
  data: RatingData
  length: number
  error: null
  statusCode: number
}

export interface MedianRatingResponse {
  data: number
  length: number
  error: null
  statusCode: number
}

export const reviewService = {
  async getReviewsByPropertyId(propertyId: string): Promise<ReviewsResponse> {
    try {
      const response = await apiClient.get<ReviewsResponse>(
        `/reviews/property/${propertyId}`
      )
      return response.data
    } catch (error: any) {
      console.error('reviewService: Error fetching reviews:', error)
      throw error
    }
  },

  async getRatingDataByPropertyId(propertyId: string): Promise<RatingDataResponse> {
    try {
      const response = await apiClient.get<RatingDataResponse>(
        `/reviews/property/${propertyId}/rating`
      )
      return response.data
    } catch (error: any) {
      console.error('reviewService: Error fetching rating data:', error)
      throw error
    }
  },

  async createReview(data: CreateReviewRequest): Promise<ReviewsResponse> {
    try {
      const response = await apiClient.post<ReviewsResponse>('/reviews', data)
      return response.data
    } catch (error: any) {
      console.error('reviewService: Error creating review:', error)
      throw error
    }
  },

  async getMedianRatingByPropertyId(propertyId: string): Promise<MedianRatingResponse> {
    try {
      const response = await apiClient.get<MedianRatingResponse>(
        `/reviews/property/${propertyId}/rating/median`
      )
      return response.data
    } catch (error: any) {
      console.error('reviewService: Error fetching median rating:', error)
      throw error
    }
  },
}
