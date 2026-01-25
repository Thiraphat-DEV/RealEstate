import { useState, useRef, useEffect, memo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/context/AuthContext'
import { Spinner } from '../ui'

interface HeaderProps {
  title?: string
}

export const Header = memo(({ title = 'Real Estate' }: HeaderProps) => {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  const handleLogout = async () => {
    await logout()
    setShowDropdown(false)
    navigate('/')
  }

  const handleFavourites = async () => {
    setShowDropdown(false)
    navigate('/favourites')
  }

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 transition-shadow duration-200">
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 m-0 leading-tight">
                {title}
              </h1>
              <p className="text-xs text-gray-500 m-0 leading-tight">
                Find Your Dream Property
              </p>
            </div>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className="px-4 py-2">
                <Spinner size="sm" />
              </div>
            ) : isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span>👤</span>
                  <span>{user.name || user.email}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">{user.name || user.email}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={handleFavourites}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Favourites
                    </button>
                    <button
                      onClick={() => {
                        setShowDropdown(false)
                        navigate('/view-history')
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      View History
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-white bg-gold-600 border border-gold-600 rounded-lg hover:bg-gold-700 hover:border-gold-700 transition-all duration-200"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
})

Header.displayName = 'Header'

export default Header
