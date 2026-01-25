import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { authService } from './authService'

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:5000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authService.getToken()
    console.log('API Request:', config.method?.toUpperCase(), config.url)
    console.log('API Token exists:', !!token)
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('API Token added to headers')
    } else {
      console.warn('API No token found - request may fail if endpoint requires auth')
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

export default apiClient
