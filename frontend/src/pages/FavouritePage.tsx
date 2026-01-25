import { Header, Footer, HeroSection } from '../components/layout'
import { Spinner } from '../components/ui'
import { PropertyGrid, useFavourites } from '../features/properties'

export const FavouritePage = () => {
  const { favourites, loading, error, removeFromLocal } = useFavourites()

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Header />
      <HeroSection showFilters={false} />

      <main className="w-full py-8">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                Favourite Properties
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Properties you have added to your favourites
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-600 text-xl gap-4">
              <Spinner size="lg" />
              <p>Loading your favourite properties...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 px-8 bg-white rounded-2xl border-2 border-red-300 max-w-2xl mx-auto my-8 shadow-lg">
              <p className="text-xl mb-2 text-red-600 font-semibold">
                Failed to load favourites
              </p>
              <p className="text-sm text-gray-600 italic mt-2">{error}</p>
            </div>
          ) : favourites.length === 0 ? (
            <div className="text-center py-12 px-8 bg-white rounded-2xl border-2 border-gold-300 max-w-2xl mx-auto my-8 shadow-lg">
              <p className="text-xl mb-2 text-gray-900 font-semibold">
                You have no favourite properties yet
              </p>
              <p className="text-sm text-gray-600 italic">
                Browse properties on the home page and click the heart icon to
                add them to your favourites.
              </p>
            </div>
          ) : (
            <PropertyGrid
              properties={favourites}
              loading={loading}
              allAreFavourites
              onFavouriteToggle={(propertyId, isFavourite) => {
                if (!isFavourite) {
                  removeFromLocal(propertyId)
                }
              }}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default FavouritePage

