import { LocationMaster } from '../utils/locationUtils'
import { locationsMaster } from '../assets/data/locations'
import {
  getCountries,
  getLocationsByCountry,
  getCitiesByCountry,
  getDistrictsByCity,
  formatLocationName,
  formatShortLocationName,
} from '../utils/locationUtils'

const getLocations = (): LocationMaster[] => {
  return locationsMaster
}

export const locationService = {
  // Get all locations
  getAll: (): LocationMaster[] => {
    return getLocations()
  },

  // Get all countries
  getCountries: (): string[] => {
    return getCountries(getLocations())
  },

  // Get locations by country
  getByCountry: (country: string): LocationMaster[] => {
    return getLocationsByCountry(getLocations(), country)
  },

  // Get cities by country
  getCitiesByCountry: (country: string): string[] => {
    return getCitiesByCountry(getLocations(), country)
  },

  // Get districts by city
  getDistrictsByCity: (city: string): string[] => {
    return getDistrictsByCity(getLocations(), city)
  },

  // Find location by ID
  getById: (id: number): LocationMaster | undefined => {
    return getLocations().find((loc) => loc.id === id)
  },

  // Search locations
  search: (query: string): LocationMaster[] => {
    const lowerQuery = query.toLowerCase()
    return getLocations().filter(
      (loc) =>
        loc.country.toLowerCase().includes(lowerQuery) ||
        loc.city.toLowerCase().includes(lowerQuery) ||
        loc.district.toLowerCase().includes(lowerQuery) ||
        loc.location.toLowerCase().includes(lowerQuery)
    )
  },

  // Format helpers
  formatLocationName,
  formatShortLocationName,
}

export default locationService
