import { LocationMaster } from '../../../utils/locationUtils'

export interface Property {
  id: number
  title: string
  price: number
  location: string
  address?: string
  locationId?: number
  locationData?: LocationMaster
  bedrooms?: number
  bathrooms?: number
  rooms?: number
  area?: number
  unit?: string
  floor?: number
  buildingName?: string
  images?: string[]
}
