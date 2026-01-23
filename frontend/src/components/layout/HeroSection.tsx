import { useState } from 'react'
import { Button } from '../ui'
import { locationService } from '../../services/locationService'

interface HeroSectionProps {
  onSearch?: (query: string) => void
}

export const HeroSection = ({ onSearch }: HeroSectionProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [propertyType, setPropertyType] = useState<'buy' | 'rent'>('buy')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedPropertyType, setSelectedPropertyType] = useState('')

  const locations = locationService.getCountries()
  const propertyTypes = ['Condo', 'House', 'Villa', 'Townhouse', 'Land']

  const handleSearch = () => {
    onSearch?.(searchQuery)
  }

  return (
    <div className="relative bg-gradient-to-br from-gold-500 via-gold-400 to-gold-300 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            We'll See You Home
          </h1>
          <p className="text-lg md:text-xl text-white/90">
            Find your perfect property in Thailand and across Asia
          </p>
        </div>

        {/* Advanced Search Bar */}
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-2xl p-6">
          {/* Buy/Rent Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setPropertyType('buy')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                propertyType === 'buy'
                  ? 'bg-gold-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setPropertyType('rent')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                propertyType === 'rent'
                  ? 'bg-gold-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rent
            </button>
          </div>

          {/* Search Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <select
                value={selectedPropertyType}
                onChange={(e) => setSelectedPropertyType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="">All Types</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500">
                <option>Any Price</option>
                <option>Under 5M</option>
                <option>5M - 10M</option>
                <option>10M - 20M</option>
                <option>20M - 50M</option>
                <option>Over 50M</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500">
                <option>Any</option>
                <option>1+</option>
                <option>2+</option>
                <option>3+</option>
                <option>4+</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            className="w-full py-3 text-lg font-semibold"
          >
            🔍 Search Properties
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
