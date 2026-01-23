import { Header, HeroSection, Footer } from '../components/layout'
import { Spinner } from '../components/ui'
import {
  FeaturedProperties,
  PropertyGrid,
  useProperties,
} from '../features/properties'

export const HomePage = () => {
  const { properties, loading, error } = useProperties()

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Header />
      <HeroSection />

      <main className="w-full py-8">
        {loading && properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-600 text-xl gap-4">
            <Spinner size="lg" />
            <p>Loading properties...</p>
          </div>
        ) : error || properties.length === 0 ? (
          <div className="text-center py-12 px-8 bg-white rounded-2xl border-2 border-gold-300 max-w-2xl mx-auto my-8 shadow-lg">
            <p className="text-xl mb-2 text-gray-900 font-semibold">
              ⚠️ {error || 'No properties found'}
            </p>
            <p className="text-sm text-gray-600 italic">
              Make sure the backend server is running on port 5000
            </p>
          </div>
        ) : (
          <>
            {/* Featured Properties Section */}
            <div className="mb-12 w-full">
              <FeaturedProperties properties={properties} />
            </div>

            {/* All Properties Section */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <PropertyGrid
                properties={properties}
                loading={loading}
              />
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default HomePage
