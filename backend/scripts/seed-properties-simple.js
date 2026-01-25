// Simple MongoDB seed script
// Run with: node scripts/seed-properties-simple.js
// Make sure MongoDB is running and connection string is correct

const fs = require('fs');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

// Load environment variables from .env file manually
function loadEnvFile() {
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
          process.env[key.trim()] = value;
        }
      }
    });
  }
}

loadEnvFile();

// Get MongoDB connection details from environment variables
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '27017';
const DB_USERNAME = process.env.DB_USERNAME || '';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'realestate';
const DB_SSL = process.env.DB_SSL === 'true';

// Build MongoDB connection URI
let MONGODB_URI;
if (DB_USERNAME && DB_PASSWORD) {
  MONGODB_URI = `mongodb://${DB_USERNAME}:${encodeURIComponent(DB_PASSWORD)}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;
} else {
  MONGODB_URI = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
}

console.log(`🔗 Connecting to MongoDB: ${DB_HOST}:${DB_PORT}/${DB_NAME}${DB_USERNAME ? ' (with auth)' : ''}`);

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
  'Spacious House in Din Daeng',
  'Elegant Condo in Watthana',
  'Cozy Studio in Khlong Toei',
  'Premium Apartment in Bang Sue',
  'Stylish House in Dusit',
  'Contemporary Villa in Phaya Thai',
  'Luxury Apartment in Ratchathewi',
  'Modern Condo in Samsen',
  'Spacious House in Bang Kapi',
  'Elegant Apartment in Min Buri',
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

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seedProperties() {
  const clientOptions = {
    retryWrites: true,
    w: 'majority',
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 10000,
  };

  if (DB_SSL) {
    clientOptions.tls = true;
    clientOptions.tlsAllowInvalidCertificates = true;
  }

  const client = new MongoClient(MONGODB_URI, clientOptions);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(DB_NAME);

    // Get existing master data
    const propertyTypes = await db.collection('ms_properties_type').find({}).toArray();
    const statuses = await db.collection('ms_properties_status').find({}).toArray();
    const addresses = await db.collection('ms_address').find({}).toArray();

    if (propertyTypes.length === 0) {
      console.log('⚠️  No property types found. Creating default types...');
      const defaultTypes = [
        { code: 'APARTMENT', name: 'Apartment', sortMaster: 1, createdAt: new Date(), updatedAt: new Date(), isVoid: false },
        { code: 'CONDO', name: 'Condominium', sortMaster: 2, createdAt: new Date(), updatedAt: new Date(), isVoid: false },
        { code: 'HOUSE', name: 'House', sortMaster: 3, createdAt: new Date(), updatedAt: new Date(), isVoid: false },
        { code: 'VILLA', name: 'Villa', sortMaster: 4, createdAt: new Date(), updatedAt: new Date(), isVoid: false },
        { code: 'TOWNHOUSE', name: 'Townhouse', sortMaster: 5, createdAt: new Date(), updatedAt: new Date(), isVoid: false },
      ];
      await db.collection('ms_properties_type').insertMany(defaultTypes);
      const createdTypes = await db.collection('ms_properties_type').find({}).toArray();
      propertyTypes.push(...createdTypes);
      console.log(`✅ Created ${createdTypes.length} property types`);
    }

    if (statuses.length === 0) {
      console.log('⚠️  No property statuses found. Creating default statuses...');
      const defaultStatuses = [
        { code: 'AVAILABLE', name: 'Available', sortMaster: 1, createdAt: new Date(), updatedAt: new Date(), isVoid: false },
        { code: 'SOLD', name: 'Sold', sortMaster: 2, createdAt: new Date(), updatedAt: new Date(), isVoid: false },
        { code: 'RENTED', name: 'Rented', sortMaster: 3, createdAt: new Date(), updatedAt: new Date(), isVoid: false },
        { code: 'PENDING', name: 'Pending', sortMaster: 4, createdAt: new Date(), updatedAt: new Date(), isVoid: false },
      ];
      await db.collection('ms_properties_status').insertMany(defaultStatuses);
      const createdStatuses = await db.collection('ms_properties_status').find({}).toArray();
      statuses.push(...createdStatuses);
      console.log(`✅ Created ${createdStatuses.length} property statuses`);
    }

    if (addresses.length === 0) {
      console.log('⚠️  No addresses found. Creating sample addresses...');
      const sampleAddresses = [];
      for (let i = 0; i < 20; i++) {
        sampleAddresses.push({
          address: `Sample Address ${i + 1}, ${getRandomElement(locations)}`,
          city: new ObjectId(), // You may need to create cities first
          district: `District ${i + 1}`,
          subDistrict: `Sub District ${i + 1}`,
          postalCode: `${10000 + i}`,
          latitude: 13.7563 + (Math.random() - 0.5) * 0.1,
          longitude: 100.5018 + (Math.random() - 0.5) * 0.1,
          createdAt: new Date(),
          updatedAt: new Date(),
          isVoid: false,
        });
      }
      await db.collection('ms_address').insertMany(sampleAddresses);
      const createdAddresses = await db.collection('ms_address').find({}).toArray();
      addresses.push(...createdAddresses);
      console.log(`✅ Created ${createdAddresses.length} addresses`);
    }

    const propertyTypeIds = propertyTypes.map(pt => pt._id);
    const statusIds = statuses.map(s => s._id);
    const addressIds = addresses.map(a => a._id);

    // Clear existing properties
    await db.collection('ms_properties').deleteMany({});
    console.log('✅ Cleared existing properties');

    // Generate 100 properties
    const properties = [];
    for (let i = 0; i < 100; i++) {
      const bedrooms = getRandomNumber(1, 5);
      const bathrooms = getRandomNumber(1, 4);
      const area = getRandomNumber(30, 300);
      const price = getRandomNumber(1000000, 50000000);

      properties.push({
        title: `${getRandomElement(propertyTitles)} ${i + 1}`,
        price: price,
        location: getRandomElement(locations),
        description: getRandomElement(descriptions),
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        area: area,
        propertyType: getRandomElement(propertyTypeIds),
        status: getRandomElement(statusIds),
        address: getRandomElement(addressIds),
        images: [
          `https://picsum.photos/800/600?random=${i + 1}`,
          `https://picsum.photos/800/600?random=${i + 2}`,
          `https://picsum.photos/800/600?random=${i + 3}`,
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        isVoid: false,
      });
    }

    // Insert properties
    await db.collection('ms_properties').insertMany(properties);
    console.log(`✅ Successfully created ${properties.length} properties`);

  } catch (error) {
    console.error('❌ Error seeding properties:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('✅ Database connection closed');
  }
}

seedProperties();
