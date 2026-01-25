import { useState } from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: PaginationProps) => {
  const [isChanging, setIsChanging] = useState(false)

  if (totalPages <= 1) return null

  // Simple logic: show current page ± 1, always show first and last
  const getPageNumbers = () => {
    const pages: number[] = []
    const maxVisible = 5 // Maximum pages to show

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      // Show pages around current
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      // Add ellipsis if needed
      if (start > 2) {
        // Will add ellipsis in render
      } else {
        // Add consecutive pages from 2
        for (let i = 2; i < start; i++) {
          pages.push(i)
        }
      }

      // Add pages around current
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i)
        }
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) {
        // Will add ellipsis in render
      } else {
        // Add consecutive pages to last
        for (let i = end + 1; i < totalPages; i++) {
          pages.push(i)
        }
      }

      // Always show last page
      pages.push(totalPages)
    }

    return Array.from(new Set(pages)).sort((a, b) => a - b)
  }

  const pageNumbers = getPageNumbers()

  const handlePageChange = async (page: number) => {
    if (isChanging || page === currentPage) return
    
    setIsChanging(true)
    // Add delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 200))
    onPageChange(page)
    setIsChanging(false)
  }

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* First Page Button */}
      <button
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1 || isChanging}
        className={`w-10 h-10 flex items-center justify-center rounded-md transition-all ${
          currentPage === 1 || isChanging
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:bg-gold-50 hover:text-gold-600'
        }`}
        aria-label="First page"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || isChanging}
        className={`w-10 h-10 flex items-center justify-center rounded-md transition-all ${
          currentPage === 1 || isChanging
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:bg-gold-50 hover:text-gold-600'
        }`}
        aria-label="Previous page"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => {
        const showEllipsisBefore = index > 0 && page - pageNumbers[index - 1] > 1
        const isActive = page === currentPage

        return (
          <div key={page} className="flex items-center gap-1">
            {showEllipsisBefore && (
              <span className="px-1 text-gray-400 text-lg">...</span>
            )}
            <button
              onClick={() => handlePageChange(page)}
              disabled={isChanging}
              className={`min-w-[48px] h-12 px-4 flex items-center justify-center text-xl font-medium transition-all ${
                isActive
                  ? 'text-gold-600 font-semibold border-2 border-gold-600 rounded-full'
                  : 'text-gray-600 hover:text-gold-600'
              } ${isChanging ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              aria-label={`Go to page ${page}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {page}
            </button>
          </div>
        )
      })}

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isChanging}
        className={`w-10 h-10 flex items-center justify-center rounded-md transition-all ${
          currentPage === totalPages || isChanging
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:bg-gold-50 hover:text-gold-600'
        }`}
        aria-label="Next page"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Last Page Button */}
      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages || isChanging}
        className={`w-10 h-10 flex items-center justify-center rounded-md transition-all ${
          currentPage === totalPages || isChanging
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:bg-gold-50 hover:text-gold-600'
        }`}
        aria-label="Last page"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 5l7 7-7 7M5 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  )
}

export default Pagination
