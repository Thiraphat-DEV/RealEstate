import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const csvPath = join(__dirname, 'properties-master.csv');
const outputPath = join(__dirname, 'properties-master-data.ts');

const csv = fs.readFileSync(csvPath, 'utf8');
const lines = csv.split('\n').filter(l => l.trim()).slice(1);

function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
}

const props = lines.map((line, idx) => {
  const values = parseCSVLine(line);
  // CSV format: id,title,address,price,bedrooms,bathrooms,rooms,location
  // Both address and location contain commas, so we need to reconstruct them
  // Example: 1,Title,Street, District, City Code, Country,Price,Bed,Bath,Rooms,District, City, Country
  const id = parseInt(values[0]) || idx + 1;
  const title = values[1] || '';
  
  // Find price (first large number after title)
  let priceIndex = -1;
  for (let i = 2; i < values.length; i++) {
    const num = parseInt(values[i]);
    if (!isNaN(num) && num > 1000000) {
      priceIndex = i;
      break;
    }
  }
  
  // Reconstruct address (from index 2 to priceIndex - 1)
  const addressParts = [];
  for (let i = 2; i < priceIndex; i++) {
    addressParts.push(values[i].trim());
  }
  const address = addressParts.join(', ');
  
  const price = parseInt(values[priceIndex]) || 0;
  const bedrooms = values[priceIndex + 1] ? parseInt(values[priceIndex + 1]) : undefined;
  const bathrooms = values[priceIndex + 2] ? parseInt(values[priceIndex + 2]) : undefined;
  const rooms = values[priceIndex + 3] ? parseInt(values[priceIndex + 3]) : undefined;
  
  // Reconstruct location (from priceIndex + 4 to end)
  const locationParts = [];
  for (let i = priceIndex + 4; i < values.length; i++) {
    locationParts.push(values[i].trim());
  }
  const location = locationParts.join(', ');
  
  // Generate area (sqm) based on bedrooms and rooms
  // Formula: base area + (bedrooms * 20) + (rooms * 15) + random variation
  const baseArea = 30; // Minimum studio size
  const bedroomArea = bedrooms ? bedrooms * 20 : 0;
  const roomArea = rooms ? rooms * 15 : 0;
  const randomVariation = Math.floor(Math.random() * 30) + 1; // 1-30 sqm variation
  const area = baseArea + bedroomArea + roomArea + randomVariation;
  
  // Generate 4 image URLs for each property
  const imageBaseUrl = 'https://images.unsplash.com/photo';
  const imageIds = [
    '1522708323590-d24dbb6b0267', // Modern apartment
    '1564013799917-bc1c03b0c0a5', // Living room
    '1560448204-e02f11c3d0e2', // Bedroom
    '1556912172-0a9b0e0b8b8b', // Kitchen
  ];
  const images = imageIds.map((imgId, imgIndex) => {
    // Index 1 and 3 use fixed sig (same image for all properties)
    let sig;
    if (imgIndex === 1) {
      sig = 100; // Fixed sig for index 1
    } else if (imgIndex === 3) {
      sig = 200; // Fixed sig for index 3
    } else {
      sig = id * 4 + imgIndex; // Variable sig for index 0 and 2
    }
    return `${imageBaseUrl}-${imgId}?w=800&h=600&fit=crop&auto=format&q=80&sig=${sig}`;
  });
  
  return {
    id,
    title,
    address,
    price,
    bedrooms: bedrooms || undefined,
    bathrooms: bathrooms || undefined,
    rooms: rooms || undefined,
    area,
    location,
    images,
  };
});

const tsContent = `import { Property } from '../../features/properties/types'

export const propertiesMasterData: Property[] = ${JSON.stringify(props, null, 2)} as Property[]
`;

fs.writeFileSync(outputPath, tsContent);
console.log(`Created ${outputPath} with ${props.length} properties`);
