import { Property } from '../../features/properties/types'

// Parse CSV content to Property array
export const parsePropertiesFromCSV = (csvContent: string): Property[] => {
  const lines = csvContent.split('\n').filter(line => line.trim())
  
  return lines.slice(1).map((line, index) => {
    // Handle CSV with quoted fields
    const values: string[] = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    values.push(current.trim())
    
    return {
      id: parseInt(values[0]) || index + 1,
      title: values[1] || '',
      address: values[2] || '',
      price: parseInt(values[3]) || 0,
      bedrooms: parseInt(values[4]) || undefined,
      bathrooms: parseInt(values[5]) || undefined,
      rooms: parseInt(values[6]) || undefined,
      location: values[7] || '',
    }
  })
}

// Sample data for fallback
export const propertiesMasterData: Property[] = []
