import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react'
import { authService, User } from '../../../services/authService'
import { handleApiError } from '../../../utils/errorHandler'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    let isCancelled = false
    
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const token = authService.getToken()
        const currentUser = authService.getCurrentUser()
        
        console.log('checkAuth - token:', token ? 'exists' : 'null', 'user:', currentUser ? 'exists' : 'null')
        
        // If no token or user, skip API call
        if (!token || !currentUser) {
          console.log('checkAuth - No token or user, setting loading to false', { 
            hasToken: !!token, 
            hasUser: !!currentUser,
            tokenValue: token ? 'exists' : 'null',
            userValue: currentUser ? JSON.stringify(currentUser) : 'null'
          })
          if (!isCancelled && isMountedRef.current) {
            setUser(null)
            setIsLoading(false)
          }
          return
        }

        // Set user from localStorage first (optimistic update)
        if (!isCancelled && isMountedRef.current && currentUser) {
          console.log('checkAuth - Setting user from localStorage:', currentUser)
          setUser(currentUser)
        }

        // Verify token by fetching profile with timeout
        try {
          console.log('checkAuth - Fetching profile...')
          const profilePromise = authService.getProfile()
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
          )
          
          const profile = await Promise.race([profilePromise, timeoutPromise])
          
          console.log('checkAuth - Profile fetched:', profile)
          if (!isCancelled && isMountedRef.current) {
            setUser(profile)
            setIsLoading(false)
          }
        } catch (error) {
          // Token invalid or timeout, but keep user from localStorage if available
          console.warn('checkAuth - Profile fetch failed:', error)
              // Don't logout immediately, keep user from localStorage
              // Note: We don't await logout here to avoid blocking
          if (!isCancelled && isMountedRef.current) {
            setIsLoading(false)
            // Only clear user if we can't verify token
            if (currentUser) {
              console.log('checkAuth - Keeping user from localStorage despite profile fetch failure')
            } else {
              // Fire and forget - don't await to avoid blocking
        authService.logout().catch(err => console.error('Logout error:', err))
              setUser(null)
            }
          }
        }
      } catch (error) {
        // If any error occurs, ensure user is null and loading is false
        console.error('checkAuth - Auth check error:', error)
        // Fire and forget - don't await to avoid blocking
        authService.logout().catch(err => console.error('Logout error:', err))
        if (!isCancelled && isMountedRef.current) {
          setUser(null)
          setIsLoading(false)
        }
      } finally {
        // Always ensure loading is false after check completes
        console.log('checkAuth - Finally block, isCancelled:', isCancelled, 'isMounted:', isMountedRef.current)
        if (!isCancelled) {
          console.log('checkAuth - Setting isLoading to false in finally')
          setIsLoading(false)
        }
      }
    }
    
    // Call checkAuth and handle any unhandled promise rejection
    checkAuth().catch((error) => {
      console.error('checkAuth - Unhandled error:', error)
      if (!isCancelled && isMountedRef.current) {
        setUser(null)
        setIsLoading(false)
      }
    })

    // Cleanup function
    return () => {
      console.log('checkAuth - Cleanup called')
      isCancelled = true
      isMountedRef.current = false
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      console.log('AuthContext: Starting login...')
      const response = await authService.login({ email, password })
      console.log('AuthContext: Login successful, user:', response.user)
      
      // Set user state immediately after login (React will handle cleanup if component unmounts)
      console.log('AuthContext: Setting user state:', response.user)
      setUser(response.user)
      setIsLoading(false)
    } catch (error) {
      console.error('AuthContext: Login error:', error)
      const apiError = handleApiError(error)
      throw new Error(apiError.message)
    }
  }, [])

  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      console.log('AuthContext: Starting registration...', { email, name })
      // Register user only (no automatic login)
      const result = await authService.register({ email, password, name })
      console.log('AuthContext: Registration successful', result)
      // User will be redirected to login page after successful registration
    } catch (error) {
      console.error('AuthContext: Registration error:', error)
      const apiError = handleApiError(error)
      // Re-throw with proper error message
      const errorMessage = apiError.message || 'Registration failed. Please try again.'
      throw new Error(errorMessage)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      if (isMountedRef.current) {
        setUser(null)
      }
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
