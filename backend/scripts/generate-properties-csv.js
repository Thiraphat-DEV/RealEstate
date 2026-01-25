// Script to generate CSV file for properties
// This generates sample data that can be used to create master data first

const fs = require('fs');
const path = require('path');

const propertyTitles = [
  'Luxury Condominium in Sukhumvit',
  'Modern Apartment in Silom',
  'Spacious House in Bangna',
  'Elegant Villa in Thonglor',
  'Cozy Studio in Asoke',
  'Premium Penthouse in Sathorn',
  'Family Home in Phra Khanong',
  'Stylish Loft in Ekkamai',
  'Contemporary Apartment in Phrom Phong',
  'Charming House in Ari',
  'Luxury Apartment in Ratchada',
  'Modern Condo in On Nut',
  'Spacious Villa in Lat Phrao',
  'Elegant Townhouse in Chatuchak',
  'Cozy Apartment in Victory Monument',
  'Premium House in Rama 9',
  'Stylish Condo in Thonburi',
  'Contemporary Villa in Nonthaburi',
  'Luxury Penthouse in Pathumwan',
  'Modern Apartment in Huai Khwang',
];

const locations = [
  'Bangkok, Thailand',
  'Chiang Mai, Thailand',
  'Phuket, Thailand',
  'Pattaya, Thailand',
  'Hua Hin, Thailand',
  'Krabi, Thailand',
  'Ayutthaya, Thailand',
  'Kanchanaburi, Thailand',
];

const descriptions = [
  'Beautiful property with modern amenities',
  'Spacious and well-maintained property',
  'Prime location with excellent facilities',
  'Luxury property with stunning views',
  'Perfect for families and professionals',
  'Recently renovated with high-quality finishes',
  'Great investment opportunity',
  'Peaceful neighborhood with easy access',
  'Modern design with premium features',
  'Convenient location near public transport',
];

const propertyTypes = ['APARTMENT', 'CONDO', 'HOUSE', 'VILLA', 'TOWNHOUSE'];
const statuses = ['AVAILABLE', 'SOLD', 'RENTED', 'PENDING'];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate CSV header
const headers = [
  'title',
  'price',
  'location',
  'description',
  'bedrooms',
  'bathrooms',
  'area',
  'propertyType',
  'status',
  'addressId',
  'images',
];

// Generate 100 rows
const rows = [];
for (let i = 0; i < 100; i++) {
  const bedrooms = getRandomNumber(1, 5);
  const bathrooms = getRandomNumber(1, 4);
  const area = getRandomNumber(30, 300);
  const price = getRandomNumber(1000000, 50000000);
  const propertyType = getRandomElement(propertyTypes);
  const status = getRandomElement(statuses);

  const row = [
    `"${getRandomElement(propertyTitles)} ${i + 1}"`,
    price,
    `"${getRandomElement(locations)}"`,
    `"${getRandomElement(descriptions)}"`,
    bedrooms,
    bathrooms,
    area,
    propertyType,
    status,
    `"ADDRESS_ID_${(i % 20) + 1}"`, // Reference to address (assuming 20 addresses exist)
    `"https://picsum.photos/800/600?random=${i + 1},https://picsum.photos/800/600?random=${i + 2},https://picsum.photos/800/600?random=${i + 3}"`,
  ];

  rows.push(row.join(','));
}

// Combine header and rows
const csvContent = [headers.join(','), ...rows].join('\n');

// Write to file
const outputPath = path.join(__dirname, 'properties-seed.csv');
fs.writeFileSync(outputPath, csvContent, 'utf8');

console.log(`✅ Generated CSV file with 100 properties: ${outputPath}`);
console.log(`📝 Note: Replace ADDRESS_ID_X with actual ObjectId from ms_address collection`);
console.log(`📝 Note: Replace propertyType and status with actual ObjectId from respective collections`);
