import { useState } from 'react'
import { Header, HeroSection, Footer } from '../components/layout'
import { Spinner } from '../components/ui'
import {
  FeaturedProperties,
  PropertyFilters,
  PropertyGrid,
  useProperties,
  type PropertyFilterState,
} from '../features/properties'
import { ContactToExpert } from '../components/contactToExpert'

export const HomePage = () => {
  const { properties, loading, error, pagination, refetch, setFilters, setPage } = useProperties()
  const [currentFilters, setCurrentFilters] = useState<PropertyFilterState>({
    propertyType: '',
    location: '',
    address: '',
    priceMin: '',
    priceMax: '',
    bedrooms: '',
    bathrooms: '',
    areaMin: '',
    areaMax: '',
    search: '',
  })

  const handleFilterChange = (filters: PropertyFilterState) => {
    setCurrentFilters(filters)
    setFilters(filters)
    refetch(filters)
  }
  const hasActiveFilters = () => {
    return !!(
      currentFilters.propertyType ||
      currentFilters.location ||
      currentFilters.address ||
      currentFilters.priceMin ||
      currentFilters.priceMax ||
      currentFilters.bedrooms ||
      currentFilters.bathrooms ||
      currentFilters.areaMin ||
      currentFilters.areaMax ||
      currentFilters.search
    )
  }

  const handleRetry = () => {
    const emptyFilters: PropertyFilterState = {
      propertyType: '',
      location: '',
      address: '',
      priceMin: '',
      priceMax: '',
      bedrooms: '',
      bathrooms: '',
      areaMin: '',
      areaMax: '',
      search: '',
    }
    setCurrentFilters(emptyFilters)
    setFilters(emptyFilters)
    refetch(emptyFilters)
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Header />
      <HeroSection onFilterChange={handleFilterChange} />

      <main className="w-full py-8">
        {loading && properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-600 text-xl gap-4">
            <Spinner size="lg" />
            <p>กำลังโหลดอสังหาริมทรัพย์...</p>
          </div>
        ) : error && properties.length === 0 ? (
          <div className="text-center py-12 px-8 bg-white rounded-2xl border-2 border-red-300 max-w-2xl mx-auto my-8 shadow-lg">
            <p className="text-xl mb-2 text-red-600 font-semibold">
              ⚠️ {error}
            </p>
            <p className="text-sm text-gray-600 italic mt-4">
              กรุณาตรวจสอบ:
            </p>
            <ul className="text-sm text-gray-600 text-left mt-2 space-y-1 max-w-md mx-auto">
              <li>• เซิร์ฟเวอร์ backend กำลังทำงานบนพอร์ต 5000</li>
            </ul>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition-colors"
            >
              ลองใหม่
            </button>
          </div>
        ) : (
          <>
            <div className="mb-12 w-full relative">
              {loading && properties.length > 0 && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                  <div className="flex flex-col items-center gap-2">
                    <Spinner size="lg" />
                  </div>
                </div>
              )}
              {error && properties.length > 0 ? (
                <div className="text-center py-8 px-4 bg-red-50 rounded-lg border border-red-200 mb-4">
                  <p className="text-sm text-red-600">⚠️ {error}</p>
                </div>
              ) : null}
              {properties.length > 0 ? (
                <FeaturedProperties properties={properties} />
              ) : null}
            </div>

            <div className="w-full px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="w-full lg:w-80 flex-shrink-0">
                  <PropertyFilters
                    value={currentFilters}
                    onFilterChange={handleFilterChange}
                  />
                </div>
                <div className="flex-1 w-full relative">
                  {loading && properties.length > 0 && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                      <div className="flex flex-col items-center gap-2">
                        <Spinner size="lg" />
                      </div>
                    </div>
                  )}
                  {properties.length === 0 ? (
                    hasActiveFilters() ? (
                      <div className="text-center py-12 px-8 bg-white rounded-2xl border-2 border-gold-300 shadow-lg">
                        <p className="text-xl mb-2 text-gray-900 font-semibold">
                          📭 ไม่พบข้อมูลจากตัวกรอง
                        </p>
                        <p className="text-sm text-gray-600 italic mb-4">
                          กรุณาลองใหม่
                        </p>
                        <button
                          onClick={handleRetry}
                          className="px-6 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition-colors font-medium"
                        >
                          ลองใหม่
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-12 px-8 bg-white rounded-2xl border-2 border-gold-300 shadow-lg">
                        <p className="text-xl mb-2 text-gray-900 font-semibold">
                          📭 ไม่พบอสังหาริมทรัพย์
                        </p>
                        <p className="text-sm text-gray-600 italic">
                          ฐานข้อมูลอาจว่างเปล่า ลองสร้างอสังหาริมทรัพย์ก่อน
                        </p>
                      </div>
                    )
                  ) : (
                    <PropertyGrid
                      properties={properties}
                      loading={loading}
                      pagination={pagination}
                      onPageChange={setPage}
                    />
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />

      <ContactToExpert />
    </div>
  )
}

export default HomePage
