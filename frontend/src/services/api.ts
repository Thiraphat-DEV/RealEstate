import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { authService } from './authService'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
})

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    const token = authService.getToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor
let isRedirecting = false

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized - clear auth data using authService
      // Fire and forget - don't await to avoid blocking the error response
      authService.logout().catch(err => console.error('Logout error in interceptor:', err))
      
      // Prevent multiple redirects
      if (!isRedirecting && window.location.pathname !== '/login') {
        isRedirecting = true
        // Use setTimeout to prevent redirect during render
        setTimeout(() => {
          window.location.href = '/login'
        }, 100)
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
