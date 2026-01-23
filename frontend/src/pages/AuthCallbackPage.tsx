import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authService } from '../services/authService'

export const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get('token')
        
        if (!token) {
          setError('No token provided')
          setIsLoading(false)
          setTimeout(() => navigate('/login'), 2000)
          return
        }

        // Store token in localStorage
        localStorage.setItem('token', token)

        // Fetch user profile to get user data
        try {
          const user = await authService.getProfile()
          localStorage.setItem('user', JSON.stringify(user))
          
          // Redirect to home page - AuthContext will automatically detect the token
          // and set the user state when the page loads
          navigate('/', { replace: true })
        } catch (profileError) {
          // If profile fetch fails, token might be invalid
          await authService.logout()
          setError('Failed to fetch user profile')
          setIsLoading(false)
          setTimeout(() => navigate('/login'), 2000)
        }
      } catch (err) {
        setError('Authentication failed')
        setIsLoading(false)
        setTimeout(() => navigate('/login'), 2000)
      }
    }

    handleCallback()
  }, [searchParams, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Completing authentication...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded max-w-md">
            <p className="font-semibold">Authentication Error</p>
            <p className="mt-2">{error}</p>
            <p className="mt-4 text-sm">Redirecting to login page...</p>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default AuthCallbackPage
