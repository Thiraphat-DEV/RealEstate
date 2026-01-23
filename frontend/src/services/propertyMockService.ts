import { Property } from '../features/properties/types'
import { propertiesMasterData } from '../assets/data/properties-master-data'

// Mock service for development - returns properties from CSV data
export const propertyMockService = {
  getAll: async (): Promise<Property[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    // Return data from TypeScript file (converted from CSV)
    return propertiesMasterData
  },

  getById: async (id: number): Promise<Property | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const properties = await propertyMockService.getAll()
    return properties.find((p) => p.id === id)
  },

  getByLocation: async (locationId: number): Promise<Property[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const properties = await propertyMockService.getAll()
    return properties.filter((p) => p.locationId === locationId)
  },

  search: async (query: string): Promise<Property[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const properties = await propertyMockService.getAll()
    const lowerQuery = query.toLowerCase()
    return properties.filter(
      (p) =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.location.toLowerCase().includes(lowerQuery) ||
        p.address?.toLowerCase().includes(lowerQuery) ||
        p.buildingName?.toLowerCase().includes(lowerQuery)
    )
  },
}

export default propertyMockService
