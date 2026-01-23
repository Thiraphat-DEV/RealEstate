// Location master data types
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

// Helper function to parse CSV data
export const parseLocationCSV = (csvText: string): LocationMaster[] => {
  const lines = csvText.trim().split('\n')
  const headers = lines[0].split(',')
  
  return lines.slice(1).map((line) => {
    const values = line.split(',')
    return {
      id: parseInt(values[0], 10),
      country: values[1],
      location: values[2],
      region: values[3],
      city: values[4],
      district: values[5],
      postal_code: values[6],
      latitude: parseFloat(values[7]),
      longitude: parseFloat(values[8]),
    }
  })
}

// Get all countries
export const getCountries = (locations: LocationMaster[]): string[] => {
  return Array.from(new Set(locations.map((loc) => loc.country))).sort()
}

// Get locations by country
export const getLocationsByCountry = (
  locations: LocationMaster[],
  country: string
): LocationMaster[] => {
  return locations.filter((loc) => loc.country === country)
}

// Get cities by country
export const getCitiesByCountry = (
  locations: LocationMaster[],
  country: string
): string[] => {
  return Array.from(
    new Set(
      locations.filter((loc) => loc.country === country).map((loc) => loc.city)
    )
  ).sort()
}

// Get districts by city
export const getDistrictsByCity = (
  locations: LocationMaster[],
  city: string
): string[] => {
  return Array.from(
    new Set(
      locations.filter((loc) => loc.city === city).map((loc) => loc.district)
    )
  ).sort()
}

// Format location display name
export const formatLocationName = (location: LocationMaster): string => {
  return `${location.district}, ${location.city}, ${location.country}`
}

// Format short location name (for property cards)
export const formatShortLocationName = (location: LocationMaster): string => {
  return `${location.district}, ${location.city}`
}
