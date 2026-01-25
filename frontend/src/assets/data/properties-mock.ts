import { Property } from '../../features/properties/types'
import { locationService } from '../../services/locationService'
import { LocationMaster } from '../../utils/locationUtils'

// Generate mock properties with prices and addresses
const generateMockProperties = (): Property[] => {
  const locations = locationService.getAll()
  const propertyTypes = [
    'Luxury Condominium',
    'Modern Apartment',
    'Studio Unit',
    'Penthouse Suite',
    'Executive Condo',
    'Waterfront Residence',
    'Sky Villa',
    'Garden View Unit',
  ]

  const buildingNames = [
    'The Grand',
    'Sky Tower',
    'Riverside Residences',
    'Central Park',
    'Ocean View',
    'Metro Heights',
    'Garden Plaza',
    'Crystal Tower',
    'Sunset Residences',
    'Prime Location',
  ]

  const streets = [
    'Sukhumvit Road',
    'Silom Road',
    'Sathorn Road',
    'Ratchadamri Road',
    'Wireless Road',
    'Ploenchit Road',
    'Rama IV Road',
    'Charoen Krung Road',
    'Thanon Phra Athit',
    'Soi Thong Lo',
  ]

  return locations.slice(0, 50).map((location: LocationMaster, index: number) => {
    const propertyType = propertyTypes[index % propertyTypes.length]
    const buildingName = buildingNames[index % buildingNames.length]
    const streetNumber = Math.floor(Math.random() * 999) + 1
    const street = streets[index % streets.length]
    const floor = Math.floor(Math.random() * 30) + 1
    const unit = `${Math.floor(Math.random() * 20) + 1}${String.fromCharCode(65 + (index % 26))}`

    // Generate realistic prices based on location
    let basePrice = 5000000 // 5M THB base
    if (location.country === 'Thailand' && location.city === 'Bangkok') {
      if (['Sukhumvit', 'Sathorn', 'Silom', 'Chidlom', 'Lumpini'].includes(location.district)) {
        basePrice = 15000000 + Math.random() * 10000000 // 15-25M for prime areas
      } else {
        basePrice = 8000000 + Math.random() * 7000000 // 8-15M for other areas
      }
    } else if (location.country === 'Singapore') {
      basePrice = 800000 + Math.random() * 1200000 // 800K-2M SGD
    } else if (location.country === 'Malaysia') {
      basePrice = 800000 + Math.random() * 1200000 // 800K-2M MYR
    } else {
      basePrice = 5000000 + Math.random() * 5000000 // 5-10M for others
    }

    const bedrooms = index % 4 === 0 ? 1 : index % 4 === 1 ? 2 : index % 4 === 2 ? 3 : 4
    const bathrooms = bedrooms === 1 ? 1 : bedrooms === 2 ? 2 : bedrooms + 1
    const area = bedrooms * 35 + Math.floor(Math.random() * 30) // 35-65 ตารางเมตร per bedroom

    // Generate 4 placeholder images using Unsplash or similar service
    // Using placeholder.com for now, can be replaced with actual image URLs
    const imageBaseUrl = 'https://images.unsplash.com/photo'
    const imageIds = [
      '1522708323590-d24dbb6b0267', // Modern apartment
      '1564013799917-bc1c03b0c0a5', // Living room
      '1560448204-e02f11c3d0e2', // Bedroom
      '1556912172-0a9b0e0b8b8b', // Kitchen
    ]
    const images = imageIds.map((imgId, imgIndex) => 
      `${imageBaseUrl}-${imgId}?w=400&h=300&fit=crop&auto=format&q=80&sig=${index * 4 + imgIndex}`
    )

    return {
      id: index + 1,
      title: `${propertyType} at ${buildingName}`,
      price: Math.floor(basePrice),
      location: `${location.district}, ${location.city}, ${location.country}`,
      address: `${streetNumber} ${street}, ${location.district}, ${location.city} ${location.postal_code}, ${location.country}`,
      locationId: location.id,
      locationData: location,
      bedrooms,
      bathrooms,
      area,
      unit: `${floor}${unit}`,
      floor,
      buildingName,
      images,
    }
  })
}

export const mockProperties: Property[] = generateMockProperties()
