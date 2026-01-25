import { useEffect, useState } from 'react'
import {
  masterService,
  type PropertyTypeMaster,
  type CityMaster,
} from '../../../services/masterService'
import type { PropertyFilterState } from '../types'

interface PropertyFiltersProps {
  value?: PropertyFilterState
  onFilterChange?: (filters: PropertyFilterState) => void
}

export const PropertyFilters = ({ value, onFilterChange }: PropertyFiltersProps) => {
  const [internalFilters, setInternalFilters] = useState<PropertyFilterState>({
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

  const filters = value ?? internalFilters

  const [locations, setLocations] = useState<CityMaster[]>([])
  const [propertyTypes, setPropertyTypes] = useState<PropertyTypeMaster[]>([])
  const [bedroomOptions, setBedroomOptions] = useState<number[]>([])
  
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

  // Sync localFilters with value when value changes (for controlled mode)
  useEffect(() => {
    if (value) {
      setInternalFilters(value)
      setLocalFilters(value)
    }
  }, [value])

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
      }
    }

    loadMasters()

    return () => {
      isMounted = false
    }
  }, [])

  const handleLocalChange = (key: keyof PropertyFilterState, value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSubmitAll = (e: React.FormEvent) => {
    e.preventDefault()
    
    const filtersToSubmit: PropertyFilterState = {
      ...localFilters,
      search: localFilters.search.trim(),
    }
    
    if (!value) {
      setInternalFilters(filtersToSubmit)
    }
    
    onFilterChange?.(filtersToSubmit)
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
    if (!value) {
      setInternalFilters(emptyFilters)
    }
    onFilterChange?.(emptyFilters)
  }

  useEffect(() => {} , [localFilters, filters, locations, propertyTypes, bedroomOptions])

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">ตัวกรอง</h3>
          <button
            onClick={clearFilters}
            type="button"
            className="text-sm text-gold-600 hover:text-gold-700 font-medium"
          >
            เคลียร์ตัวกรอง
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmitAll}>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ประเภท
            </label>
            <select
              value={localFilters.propertyType}
              onChange={(e) => handleLocalChange('propertyType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
            >
              <option value="">ทุกประเภท</option>
              {propertyTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              สถานที่
            </label>
            <select
              value={localFilters.location}
              onChange={(e) => handleLocalChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
            >
              <option value="">ทุกสถานที่</option>
              {locations.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name} {city.province ? `(${city.province})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by title, location, or master data..."
              value={localFilters.search}
              onChange={(e) => handleLocalChange('search', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ช่วงราคา (฿)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="ต่ำสุด"
                value={localFilters.priceMin}
                onChange={(e) => handleLocalChange('priceMin', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <input
                type="number"
                placeholder="สูงสุด"
                value={localFilters.priceMax}
                onChange={(e) => handleLocalChange('priceMax', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ห้องนอน
            </label>
            <select
              value={localFilters.bedrooms}
              onChange={(e) => handleLocalChange('bedrooms', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
            >
              <option value="">-</option>
              {bedroomOptions.map((value) => (
                <option key={value} value={value.toString()}>
                  {value}+
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ห้องน้ำ
            </label>
            <select
              value={localFilters.bathrooms}
              onChange={(e) => handleLocalChange('bathrooms', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
            >
              <option value="">-</option>
              {bedroomOptions.map((value) => (
                <option key={value} value={value.toString()}>
                  {value}+
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              พื้นที่ (ตารางเมตร)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="ต่ำสุด"
                value={localFilters.areaMin}
                onChange={(e) => handleLocalChange('areaMin', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <input
                type="number"
                placeholder="สูงสุด"
                value={localFilters.areaMax}
                onChange={(e) => handleLocalChange('areaMax', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="w-full px-6 py-3 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition-colors font-medium text-base"
          >
            ใช้ตัวกรอง
          </button>
        </div>
      </form>
    </div>
  )
}

export default PropertyFilters
