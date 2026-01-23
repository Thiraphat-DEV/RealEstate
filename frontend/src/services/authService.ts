import apiClient from './api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  access_token: string
  user: {
    id: string
    email: string
    name: string
  }
}

export interface User {
  id: string
  email: string
  name: string
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
      const { access_token, user } = response.data
      
      // Check if user exists in response
      if (!user || !user.id) {
        throw new Error('User not found in response')
      }
      
      // Store token in localStorage
      localStorage.setItem('token', access_token)
      localStorage.setItem('user', JSON.stringify(user))
      
      return response.data
    } catch (error: any) {
      // Check for userNotFound error from server
      if (error?.response?.data?.message?.toLowerCase().includes('user not found') ||
          error?.response?.data?.message?.toLowerCase().includes('invalid credentials')) {
        throw new Error('User not found. Please check your email and password.')
      }
      throw error
    }
  },

  register: async (data: RegisterData): Promise<User> => {
    try {
      const response = await apiClient.post<User>('/auth/register', data)
      
      // Check if user exists in response
      if (!response.data || !response.data.id) {
        throw new Error('User registration failed - no user data returned')
      }
      
      return response.data
    } catch (error: any) {
      console.error('Register error:', error)
      // Re-throw with better error message
      if (error?.response?.data?.message) {
        const errorMessage = Array.isArray(error.response.data.message)
          ? error.response.data.message.join(', ')
          : error.response.data.message
        throw new Error(errorMessage)
      }
      if (error?.response?.data?.error) {
        throw new Error(error.response.data.error)
      }
      if (error?.message) {
        throw error
      }
      throw new Error('Registration failed. Please try again.')
    }
  },

  logout: async (): Promise<void> => {
    try {
      // Call logout API to log the transaction
      await apiClient.post('/auth/logout')
    } catch (error: any) {
      // Even if API call fails, still clear local storage
      console.error('Logout API error:', error)
    } finally {
      // Always clear local storage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch {
        return null
      }
    }
    return null
  },

  getToken: (): string | null => {
    return localStorage.getItem('token')
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token')
  },

  getProfile: async (): Promise<User> => {
    try {
      const response = await apiClient.get<User>('/auth/profile')
      
      // Check if user exists in response
      if (!response.data || !response.data.id) {
        throw new Error('User not found')
      }
      
      return response.data
    } catch (error: any) {
      // Check for userNotFound error from server
      if (error?.response?.status === 401 || 
          error?.response?.data?.message?.toLowerCase().includes('user not found') ||
          error?.response?.data?.message?.toLowerCase().includes('unauthorized')) {
        throw new Error('User not found. Please login again.')
      }
      throw error
    }
  },

  getUserByKeycloakID: async (keycloakID: string): Promise<User> => {
    try {
      const response = await apiClient.get<User>(`/auth/user/${keycloakID}`)
      
      // Check if user exists in response
      if (!response.data || !response.data.id) {
        throw new Error('User not found')
      }
      
      return response.data
    } catch (error: any) {
      // Check for userNotFound error from server
      if (error?.response?.status === 404) {
        throw new Error('User not found with the provided Keycloak ID')
      }
      if (error?.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      throw error
    }
  },
}

export default authService
