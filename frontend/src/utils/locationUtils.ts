export interface LocationMaster {
  id: number
  country: string
  location: string
  region: string
  city: string
  district: string
  postal_code: string
  latitude: number
  longitude: number
}

export const getCountries = (locations: LocationMaster[]): string[] => {
  const countries = new Set<string>()
  locations.forEach((loc) => countries.add(loc.country))
  return Array.from(countries).sort()
}

export const getLocationsByCountry = (
  locations: LocationMaster[],
  country: string
): LocationMaster[] => {
  return locations.filter((loc) => loc.country === country)
}

export const getCitiesByCountry = (
  locations: LocationMaster[],
  country: string
): string[] => {
  const cities = new Set<string>()
  locations
    .filter((loc) => loc.country === country)
    .forEach((loc) => cities.add(loc.city))
  return Array.from(cities).sort()
}

export const getDistrictsByCity = (
  locations: LocationMaster[],
  city: string
): string[] => {
  const districts = new Set<string>()
  locations
    .filter((loc) => loc.city === city)
    .forEach((loc) => districts.add(loc.district))
  return Array.from(districts).sort()
}

export const formatLocationName = (location: LocationMaster): string => {
  return `${location.district}, ${location.city}, ${location.country}`
}

export const formatShortLocationName = (location: LocationMaster): string => {
  return `${location.city}, ${location.country}`
}
