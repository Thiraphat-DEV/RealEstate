import { AddressMaster, PropertyTypeMaster } from "../../../services/masterService"

export interface Property {
  id: string // mapped from _id
  title: string
  price: number
  location: string // string from backend
  description?: string
  bedrooms?: number
  bathrooms?: number
  area?: number
  images?: string[]
  propertyType?: string // propertyType ID (from backend)
  propertyTypeName?: string // propertyType name (from backend)
  type?: PropertyTypeMaster // Full propertyType object (if available)
  status?: string // status ID
  statusName?: string // status name
  address?: AddressMaster
  createdAt?: string
  updatedAt?: string
  rating?: number // Median rating (added by frontend)
  nextPropertyID?: string | null // Next property ID (from getPropertyById)
  viewHistoryId?: string // View history ID (from view history)
}

export interface PropertyFilterState {
  propertyType: string
  location: string
  address: string
  priceMin: string
  priceMax: string
  bedrooms: string
  bathrooms: string
  areaMin: string
  areaMax: string
  search: string
  page?: number
  pageLimit?: number
}
