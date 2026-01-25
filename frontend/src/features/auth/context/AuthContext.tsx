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
    
    const checkAuth = async () => {
      try {
        const token = authService.getToken()
        const currentUser = authService.getCurrentUser()
        
        if (!token || !currentUser) {
          if (!isCancelled && isMountedRef.current) {
            setUser(null)
            setIsLoading(false)
          }
          return
        }

        if (!isCancelled && isMountedRef.current && currentUser) {
          setUser(currentUser)
        }

        try {
          const profilePromise = authService.getProfile()
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
          )
          
          const profile = await Promise.race([profilePromise, timeoutPromise])
          
          if (!isCancelled && isMountedRef.current) {
            setUser(profile)
            setIsLoading(false)
          }
        } catch (error) {
          if (!isCancelled && isMountedRef.current) {
            setIsLoading(false)
            if (currentUser) {
            } else {
        authService.logout().catch(() => {})
              setUser(null)
            }
          }
        }
      } catch (error) {
        authService.logout().catch(() => {})
        if (!isCancelled && isMountedRef.current) {
          setUser(null)
          setIsLoading(false)
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }
    
    checkAuth().catch(() => {
      if (!isCancelled && isMountedRef.current) {
        setUser(null)
        setIsLoading(false)
      }
    })

    return () => {
      isCancelled = true
      isMountedRef.current = false
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password })
      setUser(response.user)
      setIsLoading(false)
    } catch (error) {
      const apiError = handleApiError(error)
      throw new Error(apiError.message)
    }
  }, [])

  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      await authService.register({ email, password, name })
    } catch (error) {
      const apiError = handleApiError(error)
      const errorMessage = apiError.message || 'Registration failed. Please try again.'
      throw new Error(errorMessage)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch (error) {
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
