import { AxiosError } from 'axios'

export interface ApiError {
  message: string
  status?: number
  errors?: Record<string, string[]>
}

export const handleApiError = (error: unknown): ApiError => {
  // Handle Axios errors
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as AxiosError<{ 
      message?: string | string[]
      error?: string
      errors?: Record<string, string[]>
      statusCode?: number
    }>
    
    if (axiosError.response) {
      const { status, data } = axiosError.response
      
      let message = 'An error occurred'
      
      if (data?.message) {
        message = Array.isArray(data.message) 
          ? data.message.join(', ') 
          : data.message
      } else if (data?.error) {
        message = data.error
      } else {
        switch (status) {
          case 400:
            message = 'Bad request. Please check your input'
            break
          case 401:
            message = 'Invalid credentials'
            break
          case 403:
            message = 'Access denied'
            break
          case 404:
            message = 'Resource not found'
            break
          case 409:
            message = 'This email is already registered. Please use a different email or try logging in.'
            break
          case 422:
            message = 'Validation error. Please check your input'
            break
          default:
            if (status >= 500) {
              message = 'Server error. Please try again later'
            }
        }
      }
      
      return {
        message,
        status,
        errors: data?.errors,
      }
    }
    
    // Network error
    if (axiosError.request) {
      return {
        message: 'Network error. Please check your connection',
        status: 0,
      }
    }
  }
  
  // Handle standard Error objects
  if (error instanceof Error) {
    return {
      message: error.message || 'An unexpected error occurred',
    }
  }
  
  // Fallback
  return {
    message: 'An unexpected error occurred. Please try again',
  }
}

export const formatValidationErrors = (errors?: Record<string, string[]>): string => {
  if (!errors) return ''
  
  return Object.entries(errors)
    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
    .join('\n')
}
