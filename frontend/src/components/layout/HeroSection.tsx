import { useEffect, useState } from 'react'
import { Button } from '../ui'
import {
  masterService,
  type PropertyTypeMaster,
  type CityMaster,
} from '../../services/masterService'
import type { PropertyFilterState } from '../../features/properties/types'

interface HeroSectionProps {
  onSearch?: (query: string) => void
  onFilterChange?: (filters: PropertyFilterState) => void
  showFilters?: boolean
}

export const HeroSection = ({ onSearch, onFilterChange, showFilters = true }: HeroSectionProps) => {
  const [locations, setLocations] = useState<CityMaster[]>([])
  const [propertyTypes, setPropertyTypes] = useState<PropertyTypeMaster[]>([])
  const [bedroomOptions, setBedroomOptions] = useState<number[]>([])
  
  // Local state for form inputs (not triggering filter immediately)
  const [localFilters, setLocalFilters] = useState<PropertyFilterState>({
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

  useEffect(() => {
    let isMounted = true

    const loadMasters = async () => {
      try {
        const [cities, types, bedrooms] = await Promise.all([
          masterService.getCities(),
          masterService.getPropertyTypes(),
          masterService.getBedrooms(),
        ])

        if (!isMounted) return

        setLocations(cities)
        setPropertyTypes(types)
        setBedroomOptions(bedrooms)
      } catch (error) {
        console.error('Failed to load master data', error)
      }
    }

    loadMasters()

    return () => {
      isMounted = false
    }
  }, [])

  // Update local filters state (doesn't trigger filter immediately)
  const handleLocalChange = (key: keyof PropertyFilterState, value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  // Submit all filters at once
  const handleSubmitAll = (e: React.FormEvent) => {
    e.preventDefault()
    const filtersToSubmit: PropertyFilterState = {
      ...localFilters,
      search: localFilters.search.trim(),
    }
    onFilterChange?.(filtersToSubmit)
    onSearch?.(filtersToSubmit.search)
  }

  const clearFilters = () => {
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
    setLocalFilters(emptyFilters)
    onFilterChange?.(emptyFilters)
  }

  return (
    <div className="relative bg-gradient-to-br from-gold-500 via-gold-400 to-gold-300 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            We'll See You Home
          </h1>
          <p className="text-lg md:text-xl text-white/90">
            Find your perfect property in Thailand and across Asia
          </p>
        </div>

        {showFilters && (
          /* Advanced Search Bar */
          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl p-8">
          {/* Search Filters - Horizontal Layout */}
          <form onSubmit={handleSubmitAll}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-6 mb-6">
              {/* Search */}
              <div className="md:col-span-2 lg:col-span-3 xl:col-span-4 2xl:col-span-7">
                <label className="block text-base font-medium text-gray-700 mb-3 text-center">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search by title, location..."
                  value={localFilters.search}
                  onChange={(e) => handleLocalChange('search', e.target.value)}
                  className="w-full px-5 py-3.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              {/* Location */}
              <div className="md:col-span-2 lg:col-span-3 xl:col-span-4 2xl:col-span-4 md:row-start-2">
                <label className="block text-base font-medium text-gray-700 mb-3">
                  สถานที่
                </label>
                <select
                  value={localFilters.location}
                  onChange={(e) => handleLocalChange('location', e.target.value)}
                  className="w-full px-5 py-3.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                >
                  <option value="">ทุกสถานที่</option>
                  {locations.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name} {city.province ? `(${city.province})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Property Type */}
              <div className="md:col-span-1 md:row-start-2">
                <label className="block text-base font-medium text-gray-700 mb-3">
                  ประเภทสถานที่
                </label>
                <select
                  value={localFilters.propertyType}
                  onChange={(e) => handleLocalChange('propertyType', e.target.value)}
                  className="w-full px-5 py-3.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                >
                  <option value="">ทุกประเภท</option>
                  {propertyTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bedrooms */}
              <div className="md:row-start-2">
                <label className="block text-base font-medium text-gray-700 mb-3">
                  ห้องนอน
                </label>
                <select
                  value={localFilters.bedrooms}
                  onChange={(e) => handleLocalChange('bedrooms', e.target.value)}
                  className="w-full px-5 py-3.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                >
                  <option value="">-</option>
                  {bedroomOptions.map((value) => (
                    <option key={value} value={value.toString()}>
                      {value}+
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="md:col-span-2 lg:col-span-4 xl:col-span-4 2xl:col-span-4 md:row-start-3">
                <label className="block text-base font-medium text-gray-700 mb-3">
                  ช่วงราคา (฿)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="ต่ำสุด"
                    value={localFilters.priceMin}
                    onChange={(e) => handleLocalChange('priceMin', e.target.value)}
                    className="px-5 py-3.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                  <input
                    type="number"
                    placeholder="สูงสุด"
                    value={localFilters.priceMax}
                    onChange={(e) => handleLocalChange('priceMax', e.target.value)}
                    className="px-5 py-3.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
              </div>

              {/* Area */}
              <div className="md:col-span-2 lg:col-span-3 xl:col-span-3 2xl:col-span-3 md:row-start-3">
                <label className="block text-base font-medium text-gray-700 mb-3">
                  พื้นที่ (ตารางเมตร)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="ต่ำสุด"
                    value={localFilters.areaMin}
                    onChange={(e) => handleLocalChange('areaMin', e.target.value)}
                    className="px-5 py-3.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                  <input
                    type="number"
                    placeholder="สูงสุด"
                    value={localFilters.areaMax}
                    onChange={(e) => handleLocalChange('areaMax', e.target.value)}
                    className="px-5 py-3.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
              </div>

              {/* Bathrooms */}
              <div className="md:row-start-2">
                <label className="block text-base font-medium text-gray-700 mb-3">
                  ห้องน้ำ
                </label>
                <select
                  value={localFilters.bathrooms}
                  onChange={(e) => handleLocalChange('bathrooms', e.target.value)}
                  className="w-full px-5 py-3.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                >
                  <option value="">-</option>
                  {bedroomOptions.map((value) => (
                    <option key={value} value={value.toString()}>
                      {value}+
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                type="submit"
                className="flex-1 py-3 text-lg font-semibold"
              >
                🔍 ค้นหา
              </Button>
              <button
                type="button"
                onClick={clearFilters}
                className="px-6 py-3 text-sm text-gold-600 hover:text-gold-700 font-medium border border-gold-600 rounded-lg hover:bg-gold-50 transition-colors"
              >
                Clear All
              </button>
            </div>
          </form>
        </div>
        )}
      </div>
    </div>
  )
}

export default HeroSection
