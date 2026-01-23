import fs from 'fs';

const locations = fs.readFileSync('locations-master.csv', 'utf8')
  .split('\n')
  .slice(1)
  .filter(l => l.trim())
  .map(l => l.split(','));

const propertyTypes = [
  'Luxury Condominium',
  'Modern Apartment',
  'Studio Unit',
  'Penthouse Suite',
  'Executive Condo',
  'Waterfront Residence',
  'Sky Villa',
  'Garden View Unit',
  'Townhouse',
  'Luxury Villa'
];

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
  'Royal Residence',
  'Elite Tower',
  'Paradise Condo',
  'Golden Heights',
  'Platinum Plaza'
];

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
  'Main Street',
  'Beach Road',
  'Park Avenue',
  'Riverside Drive',
  'Central Avenue'
];

function escapeCSV(str) {
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

let csv = 'id,title,address,price,bedrooms,bathrooms,rooms,location\n';

for (let i = 0; i < 300; i++) {
  const loc = locations[i % locations.length];
  const [, country, , , city, district, postal_code] = loc;
  
  const propertyType = propertyTypes[i % propertyTypes.length];
  const buildingName = buildingNames[i % buildingNames.length];
  const street = streets[i % streets.length];
  const streetNumber = Math.floor(Math.random() * 999) + 1;
  
  const address = `${streetNumber} ${street}, ${district}, ${city} ${postal_code}, ${country}`;
  const locationStr = `${district}, ${city}, ${country}`;
  
  let basePrice = 5000000;
  if (country === 'Thailand' && city === 'Bangkok') {
    if (['Sukhumvit', 'Sathorn', 'Silom', 'Chidlom', 'Lumpini'].includes(district)) {
      basePrice = 15000000 + Math.random() * 10000000;
    } else {
      basePrice = 8000000 + Math.random() * 7000000;
    }
  } else if (country === 'Singapore') {
    basePrice = 800000 + Math.random() * 1200000;
  } else if (country === 'Malaysia') {
    basePrice = 800000 + Math.random() * 1200000;
  } else if (country === 'Japan') {
    basePrice = 10000000 + Math.random() * 15000000;
  } else if (country === 'South Korea') {
    basePrice = 5000000 + Math.random() * 8000000;
  } else {
    basePrice = 5000000 + Math.random() * 5000000;
  }
  
  const bedrooms = [1, 2, 3, 4][i % 4];
  const bathrooms = bedrooms === 1 ? 1 : bedrooms === 2 ? 2 : bedrooms + 1;
  const rooms = bedrooms + bathrooms + (Math.floor(Math.random() * 3) + 1);
  const price = Math.floor(basePrice);
  const title = `${propertyType} at ${buildingName}`;
  
  csv += `${i + 1},${escapeCSV(title)},${escapeCSV(address)},${price},${bedrooms},${bathrooms},${rooms},${escapeCSV(locationStr)}\n`;
}

fs.writeFileSync('properties-master.csv', csv);
console.log('Created properties-master.csv with 300 rows');
