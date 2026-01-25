import { Property } from '../types'
import { PropertyMaster, AddressMaster } from '../../../services/masterService'

export interface PropertyModel {
  _id: string
  title: string
  price: number
  location: string
  description?: string
  bedrooms?: number
  bathrooms?: number
  area?: number
  images?: string[]
  propertyType?: PropertyMaster
  status?: PropertyMaster
  address?: AddressMaster | {
    _id?: string | { toString: () => string }
    name?: string
    district?: string
    subDistrict?: string
    city?: {
      _id?: string | { toString: () => string }
      name?: string
      province?: string
      country?: string
    }
  }
  createdAt?: string
  updatedAt?: string
  nextPropertyID?: string | null
  viewHistoryId?: string
}

export const mapProperty = (propertyProps: PropertyModel): Property => {
  // Handle propertyType - can be string ID or object from aggregation
  let propertyType: string | undefined = undefined
  let propertyTypeName: string | undefined = propertyProps.propertyTypeName
  let type: PropertyTypeMaster | undefined = undefined

  if (propertyProps.propertyType) {
    if (typeof propertyProps.propertyType === 'string') {
      propertyType = propertyProps.propertyType
    } else {
      // It's an object from aggregation
      const id = propertyProps.propertyType._id
      propertyType = typeof id === 'string' 
        ? id 
        : id?.toString?.() || undefined
      propertyTypeName = propertyProps.propertyType.name || propertyTypeName
      
      // Create full PropertyTypeMaster object if we have all fields
      if (propertyType && propertyProps.propertyType.name) {
        type = {
          id: propertyType,
          code: propertyProps.propertyType.code || '',
          name: propertyProps.propertyType.name,
        }
      }
    }
  }

  // Handle status - can be string ID or object from aggregation
  let status: string | undefined = undefined
  let statusName: string | undefined = propertyProps.statusName

  if (propertyProps.status) {
    if (typeof propertyProps.status === 'string') {
      status = propertyProps.status
    } else {
      // It's an object from aggregation
      const id = propertyProps.status._id
      status = typeof id === 'string' 
        ? id 
        : id?.toString?.() || undefined
      statusName = propertyProps.status.name || statusName
    }
  }

  // Handle address - can be string ID or object with city
  let address: Property['address'] = undefined
  if (propertyProps.address) {
    if (typeof propertyProps.address === 'string') {
      address = { id: propertyProps.address, code: '', name: propertyProps.address }
    } else {
      const addressId = propertyProps.address._id
      const id = typeof addressId === 'string' 
        ? addressId 
        : addressId?.toString?.() || ''
      
      address = {
        id: id,
        code: '',
        name: propertyProps.address.name || '',
        district: propertyProps.address.district,
        subDistrict: propertyProps.address.subDistrict,
        city: propertyProps.address.city ? {
          id: typeof propertyProps.address.city._id === 'string'
            ? propertyProps.address.city._id
            : propertyProps.address.city._id?.toString?.() || '',
          code: '',
          name: propertyProps.address.city.name || '',
          province: propertyProps.address.city.province,
        } : undefined,
      }
    }
  }

  return {
    id: propertyProps._id,
    title: propertyProps.title,
    price: propertyProps.price,
    location: propertyProps.location,
    description: propertyProps.description,
    bedrooms: propertyProps.bedrooms,
    bathrooms: propertyProps.bathrooms,
    area: propertyProps.area,
    images: propertyProps.images || [],
    propertyType: propertyType,
    propertyTypeName: propertyTypeName,
    type: type,
    status: status,
    statusName: statusName,
    address: address,
    createdAt: propertyProps.createdAt,
    updatedAt: propertyProps.updatedAt,
    nextPropertyID: propertyProps.nextPropertyID || null,
    viewHistoryId: propertyProps.viewHistoryId,
  }
}
