import { Property } from '../types'
import { PropertyMaster, AddressMaster, PropertyTypeMaster, CityMaster } from '../../../services/masterService'

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
  propertyType?: PropertyMaster | {
    _id?: string | { toString: () => string }
    id?: string
    code?: string
    name?: string
  }
  propertyTypeName?: string
  status?: PropertyMaster | {
    _id?: string | { toString: () => string }
    id?: string
    code?: string
    name?: string
  }
  statusName?: string
  address?: AddressMaster | {
    _id?: string | { toString: () => string }
    name?: string
    district?: string
    subDistrict?: string
    city?: CityMaster | {
      _id?: string | { toString: () => string }
      id?: string
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
      const id = ('_id' in propertyProps.propertyType ? propertyProps.propertyType._id : propertyProps.propertyType.id) || 
                 ('id' in propertyProps.propertyType ? propertyProps.propertyType.id : undefined)
      propertyType = typeof id === 'string' 
        ? id 
        : (id && typeof id === 'object' && 'toString' in id ? id.toString() : undefined) || undefined
      propertyTypeName = ('name' in propertyProps.propertyType ? propertyProps.propertyType.name : undefined) || propertyTypeName
      
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
      const id = ('_id' in propertyProps.status ? propertyProps.status._id : propertyProps.status.id) || 
                 ('id' in propertyProps.status ? propertyProps.status.id : undefined)
      status = typeof id === 'string' 
        ? id 
        : (id && typeof id === 'object' && 'toString' in id ? id.toString() : undefined) || undefined
      statusName = ('name' in propertyProps.status ? propertyProps.status.name : undefined) || statusName
    }
  }

  // Handle address - can be string ID or object with city
  let address: Property['address'] = undefined
  if (propertyProps.address) {
    if (typeof propertyProps.address === 'string') {
      address = { id: propertyProps.address, code: '', name: propertyProps.address }
    } else {
      // Check if it's AddressMaster (has 'id' property) or aggregation object (has '_id')
      const addressId = 'id' in propertyProps.address && propertyProps.address.id
        ? propertyProps.address.id
        : ('_id' in propertyProps.address && propertyProps.address._id
          ? (typeof propertyProps.address._id === 'string'
            ? propertyProps.address._id
            : propertyProps.address._id?.toString?.() || '')
          : '')
      
      address = {
        id: addressId,
        code: 'code' in propertyProps.address ? (propertyProps.address.code || '') : '',
        name: propertyProps.address.name || '',
        district: propertyProps.address.district,
        subDistrict: propertyProps.address.subDistrict,
        city: propertyProps.address.city ? (() => {
          const city = propertyProps.address.city!
          // Type guard: Check if it's CityMaster (has 'id' property)
          const isCityMaster = (c: typeof city): c is CityMaster => {
            return 'id' in c && typeof c.id === 'string' && !('_id' in c)
          }
          
          if (isCityMaster(city)) {
            return {
              id: city.id,
              code: city.code || '',
              name: city.name || '',
              province: city.province,
            }
          }
          
          // Otherwise it's an aggregation object with _id
          const cityWithId = city as { _id?: string | { toString: () => string }; id?: string; name?: string; province?: string; country?: string }
          const cityId = cityWithId.id 
            ? cityWithId.id
            : (typeof cityWithId._id === 'string' 
              ? cityWithId._id 
              : (cityWithId._id && typeof cityWithId._id === 'object' && 'toString' in cityWithId._id ? cityWithId._id.toString() : ''))
          
          return {
            id: cityId || '',
            code: '',
            name: cityWithId.name || '',
            province: cityWithId.province,
          }
        })() : undefined,
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
