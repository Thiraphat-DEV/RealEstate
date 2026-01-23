import { useState } from 'react'
import { Property } from '../types'
import { PropertyCard } from './PropertyCard'

interface PropertyGridProps {
  properties: Property[]
  loading: boolean
}

export const PropertyGrid = ({
  properties,
}: PropertyGridProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  return (
    <section className="w-full">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            All Properties
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {properties.length} properties found
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-gold-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-gold-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Grid/List View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-stretch">
          {properties.map((property) => (
            <div
              key={property.id}
              className="h-full"
            >
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 w-full">
          {properties.map((property) => {
            // Extract province from address or location
            const getProvince = () => {
              const text = property.address || property.location || ''
              const provinces = ['Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya', 'Hua Hin']
              for (const province of provinces) {
                if (text.includes(province)) {
                  return province
                }
              }
              return 'Thailand'
            }

            const province = getProvince()
            const firstImage = property.images && property.images.length > 0 
              ? property.images[0] 
              : null

            return (
              <div
                key={property.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow w-full overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image Section */}
                  <div className="w-full md:w-64 h-48 md:h-auto flex-shrink-0 relative overflow-hidden bg-gray-200">
                    {firstImage ? (
                      <img
                        src={firstImage}
                        alt={property.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          target.parentElement?.classList.add('bg-gradient-to-br', 'from-gold-500', 'to-gold-400')
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center">
                        <span className="text-5xl opacity-80">🏠</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Content Section */}
                  <div className="flex-1 p-6 flex flex-col md:flex-row">
                    {/* Left: Title and Price */}
                    <div className="flex-1 mb-4 md:mb-0 md:mr-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {property.title}
                      </h3>
                      <p className="text-2xl font-bold text-gold-600 mb-3">
                        ฿{property.price.toLocaleString()}
                      </p>
                    </div>
                    
                    {/* Right: Details */}
                    <div className="flex-shrink-0 md:w-64">
                      <div className="space-y-2 text-sm">
                        {property.address && (
                          <div className="flex items-start gap-2">
                            <span className="mt-0.5">📍</span>
                            <span className="text-gray-600">{property.address}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span>🏙️</span>
                          <span className="text-gray-600">จังหวัด: {province}</span>
                        </div>
                        {property.area && (
                          <div className="flex items-center gap-2">
                            <span>📐</span>
                            <span className="text-gray-600">{property.area} ตารางเมตร</span>
                          </div>
                        )}
                        {property.bedrooms !== undefined && (
                          <div className="flex items-center gap-2">
                            <span>🛏️</span>
                            <span className="text-gray-600">{property.bedrooms} ห้องนอน</span>
                          </div>
                        )}
                        {property.bathrooms !== undefined && (
                          <div className="flex items-center gap-2">
                            <span>🚿</span>
                            <span className="text-gray-600">{property.bathrooms} ห้องน้ำ</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default PropertyGrid
