import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import {
  MasterPropertiesEntity,
  MasterPropertiesDocument,
} from '../src/modules/schema/master/ms_properties.entity';
import { MasterPropertiesTypeEntity } from '../src/modules/schema/master/ms_properties_type.entity';
import { MasterPropertiesStatusEntity } from '../src/modules/schema/master/ms_properties_status.entity';
import { MasterAddressEntity } from '../src/modules/schema/master/ms_address.entity';
import { Types } from 'mongoose';
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

const propertyTypes = ['APARTMENT', 'CONDO', 'HOUSE', 'VILLA', 'TOWNHOUSE'];
const statuses = ['AVAILABLE', 'SOLD', 'RENTED', 'PENDING'];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePropertyData(
  index: number,
  propertyTypeIds: Types.ObjectId[],
  statusIds: Types.ObjectId[],
  addressIds: Types.ObjectId[],
) {
  const bedrooms = getRandomNumber(1, 5);
  const bathrooms = getRandomNumber(1, 4);
  const area = getRandomNumber(30, 300);
  const price = getRandomNumber(1000000, 50000000);

  return {
    title: `${getRandomElement(propertyTitles)} ${index + 1}`,
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
      `https://picsum.photos/800/600?random=${index + 1}`,
      `https://picsum.photos/800/600?random=${index + 2}`,
      `https://picsum.photos/800/600?random=${index + 3}`,
    ],
  };
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const propertiesModel = app.get<Model<MasterPropertiesDocument>>(
    getModelToken(MasterPropertiesEntity.name),
  );
  const propertyTypeModel = app.get<Model<any>>(
    getModelToken(MasterPropertiesTypeEntity.name),
  );
  const statusModel = app.get<Model<any>>(
    getModelToken(MasterPropertiesStatusEntity.name),
  );
  const addressModel = app.get<Model<any>>(
    getModelToken(MasterAddressEntity.name),
  );

  try {
    // Get existing property types
    const propertyTypes = await propertyTypeModel.find().exec();
    if (propertyTypes.length === 0) {
      console.log('Creating property types...');
      const typeData = propertyTypes.map((type) => ({
        code: type,
        name: type.charAt(0) + type.slice(1).toLowerCase(),
      }));
      await propertyTypeModel.insertMany(typeData);
      const createdTypes = await propertyTypeModel.find().exec();
      console.log(`Created ${createdTypes.length} property types`);
    }

    // Get existing statuses
    const statuses = await statusModel.find().exec();
    if (statuses.length === 0) {
      console.log('Creating property statuses...');
      const statusData = statuses.map((status) => ({
        code: status,
        name: status.charAt(0) + status.slice(1).toLowerCase(),
      }));
      await statusModel.insertMany(statusData);
      const createdStatuses = await statusModel.find().exec();
      console.log(`Created ${createdStatuses.length} property statuses`);
    }

    // Get existing addresses
    const addresses = await addressModel.find().exec();
    if (addresses.length === 0) {
      console.log('Please create addresses first');
      await app.close();
      return;
    }

    const propertyTypeIds = propertyTypes.map((pt) => pt._id);
    const statusIds = statuses.map((s) => s._id);
    const addressIds = addresses.map((a) => a._id);

    // Clear existing properties
    await propertiesModel.deleteMany({});
    console.log('Cleared existing properties');

    // Generate 100 properties
    const propertiesData = [];
    for (let i = 0; i < 100; i++) {
      propertiesData.push(
        generatePropertyData(i, propertyTypeIds, statusIds, addressIds),
      );
    }

    // Insert properties
    await propertiesModel.insertMany(propertiesData);
    console.log(`Successfully created ${propertiesData.length} properties`);

    await app.close();
  } catch (error) {
    console.error('Error seeding properties:', error);
    await app.close();
    process.exit(1);
  }
}

bootstrap();
