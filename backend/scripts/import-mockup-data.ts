import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const csv = require('csv-parser');
import { MasterCityEntity } from '../src/modules/schema/master/ms_city.entity';
import { MasterAddressEntity } from '../src/modules/schema/master/ms_address.entity';
import { MasterPropertiesStatusEntity } from '../src/modules/schema/master/ms_properties_status.entity';
import { MasterPropertiesTypeEntity } from '../src/modules/schema/master/ms_properties_type.entity';
import { MasterPropertiesEntity } from '../src/modules/schema/master/ms_properties.entity';

interface CityRow {
  code: string;
  name: string;
  province: string;
  postalCode?: string;
  country?: string;
}

interface StatusRow {
  code: string;
  name: string;
}

interface TypeRow {
  code: string;
  name: string;
}

interface AddressRow {
  address: string;
  cityCode: string;
  district?: string;
  subDistrict?: string;
  postalCode?: string;
  latitude?: string;
  longitude?: string;
}

interface PropertyRow {
  title: string;
  price: string;
  location: string;
  description?: string;
  bedrooms?: string;
  bathrooms?: string;
  area?: string;
  propertyTypeCode: string;
  statusCode: string;
  address?: string;
  images?: string;
}

async function readCSV<T>(filePath: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const results: T[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data: T) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

async function importCities(
  cityModel: Model<MasterCityEntity>,
): Promise<Map<string, Types.ObjectId>> {
  console.log('📥 Importing cities...');
  const csvPath = path.join(process.cwd(), 'mockup-data/ms_city.csv');
  const rows = await readCSV<CityRow>(csvPath);

  const cityCodeToIdMap = new Map<string, Types.ObjectId>();

  for (const row of rows) {
    try {
      // Check if city already exists
      const existing = await cityModel.findOne({ code: row.code }).exec();
      if (existing) {
        console.log(`  ⚠️  City ${row.code} already exists, skipping...`);
        cityCodeToIdMap.set(row.code, existing._id as Types.ObjectId);
        continue;
      }

      const city = new cityModel({
        code: row.code,
        name: row.name,
        province: row.province,
        postalCode: row.postalCode || undefined,
        country: row.country || 'TH',
      });

      const saved = await city.save();
      cityCodeToIdMap.set(row.code, saved._id as Types.ObjectId);
      console.log(`  ✅ Created city: ${row.code} - ${row.name}`);
    } catch (error: any) {
      console.error(`  ❌ Error creating city ${row.code}:`, error.message);
    }
  }

  console.log(`✅ Imported ${cityCodeToIdMap.size} cities\n`);
  return cityCodeToIdMap;
}

async function importStatuses(
  statusModel: Model<MasterPropertiesStatusEntity>,
): Promise<void> {
  console.log('📥 Importing property statuses...');
  const csvPath = path.join(
    process.cwd(),
    'mockup-data/ms_properties_status.csv',
  );
  const rows = await readCSV<StatusRow>(csvPath);

  for (const row of rows) {
    try {
      // Check if status already exists
      const existing = await statusModel.findOne({ code: row.code }).exec();
      if (existing) {
        console.log(`  ⚠️  Status ${row.code} already exists, skipping...`);
        continue;
      }

      const status = new statusModel({
        code: row.code,
        name: row.name,
      });

      await status.save();
      console.log(`  ✅ Created status: ${row.code} - ${row.name}`);
    } catch (error: any) {
      console.error(`  ❌ Error creating status ${row.code}:`, error.message);
    }
  }

  console.log(`✅ Imported ${rows.length} statuses\n`);
}

async function importTypes(
  typeModel: Model<MasterPropertiesTypeEntity>,
): Promise<void> {
  console.log('📥 Importing property types...');
  const csvPath = path.join(
    process.cwd(),
    'mockup-data/ms_properties_type.csv',
  );
  const rows = await readCSV<TypeRow>(csvPath);

  for (const row of rows) {
    try {
      // Check if type already exists
      const existing = await typeModel.findOne({ code: row.code }).exec();
      if (existing) {
        console.log(`  ⚠️  Type ${row.code} already exists, skipping...`);
        continue;
      }

      const type = new typeModel({
        code: row.code,
        name: row.name,
      });

      await type.save();
      console.log(`  ✅ Created type: ${row.code} - ${row.name}`);
    } catch (error: any) {
      console.error(`  ❌ Error creating type ${row.code}:`, error.message);
    }
  }

  console.log(`✅ Imported ${rows.length} types\n`);
}

async function importAddresses(
  addressModel: Model<MasterAddressEntity>,
  cityCodeToIdMap: Map<string, Types.ObjectId>,
): Promise<void> {
  console.log('📥 Importing addresses...');
  const csvPath = path.join(process.cwd(), 'mockup-data/ms_address.csv');
  const rows = await readCSV<AddressRow>(csvPath);

  let imported = 0;
  for (const row of rows) {
    try {
      const cityId = cityCodeToIdMap.get(row.cityCode);
      if (!cityId) {
        console.error(
          `  ❌ City code ${row.cityCode} not found, skipping address...`,
        );
        continue;
      }

      // Check if address already exists
      const existing = await addressModel
        .findOne({
          address: row.address,
          city: cityId,
        })
        .exec();
      if (existing) {
        console.log(
          `  ⚠️  Address "${row.address}" already exists, skipping...`,
        );
        continue;
      }

      const address = new addressModel({
        address: row.address,
        city: cityId as Types.ObjectId,
        district: row.district || undefined,
        subDistrict: row.subDistrict || undefined,
        postalCode: row.postalCode || undefined,
        latitude: row.latitude ? parseFloat(row.latitude) : undefined,
        longitude: row.longitude ? parseFloat(row.longitude) : undefined,
      });

      await address.save();
      imported++;
      console.log(`  ✅ Created address: ${row.address}`);
    } catch (error: any) {
      console.error(
        `  ❌ Error creating address "${row.address}":`,
        error.message,
      );
    }
  }

  console.log(`✅ Imported ${imported} addresses\n`);
}

async function importProperties(
  propertiesModel: Model<MasterPropertiesEntity>,
  typeModel: Model<MasterPropertiesTypeEntity>,
  statusModel: Model<MasterPropertiesStatusEntity>,
  addressModel: Model<MasterAddressEntity>,
): Promise<void> {
  console.log('📥 Importing properties...');
  const csvPath = path.join(process.cwd(), 'mockup-data/ms_properties.csv');
  const rows = await readCSV<PropertyRow>(csvPath);

  // Get all types and create code to ID map
  const types = await typeModel.find().exec();
  const typeCodeToIdMap = new Map<string, Types.ObjectId>();
  types.forEach((type) => {
    typeCodeToIdMap.set(type.code, type._id as Types.ObjectId);
  });

  // Get all statuses and create code to ID map
  const statuses = await statusModel.find().exec();
  const statusCodeToIdMap = new Map<string, Types.ObjectId>();
  statuses.forEach((status) => {
    statusCodeToIdMap.set(status.code, status._id as Types.ObjectId);
  });

  let imported = 0;
  for (const row of rows) {
    try {
      // Get property type ID
      const propertyTypeId = typeCodeToIdMap.get(row.propertyTypeCode);
      if (!propertyTypeId) {
        console.error(
          `  ❌ Property type code ${row.propertyTypeCode} not found, skipping property...`,
        );
        continue;
      }

      // Get status ID
      const statusId = statusCodeToIdMap.get(row.statusCode);
      if (!statusId) {
        console.error(
          `  ❌ Status code ${row.statusCode} not found, skipping property...`,
        );
        continue;
      }

      // Get address ID if address is provided
      let addressId: Types.ObjectId | undefined;
      if (row.address) {
        const address = await addressModel
          .findOne({ address: row.address })
          .exec();
        if (address) {
          addressId = address._id as Types.ObjectId;
        } else {
          console.warn(
            `  ⚠️  Address "${row.address}" not found, creating property without address...`,
          );
        }
      }

      // Parse images array
      const images = row.images
        ? row.images.split(',').map((img) => img.trim())
        : [];

      // Check if property already exists (by title)
      const existing = await propertiesModel
        .findOne({ title: row.title })
        .exec();
      if (existing) {
        console.log(
          `  ⚠️  Property "${row.title}" already exists, skipping...`,
        );
        continue;
      }

      const property = new propertiesModel({
        title: row.title,
        price: parseFloat(row.price),
        location: row.location,
        description: row.description || undefined,
        bedrooms: row.bedrooms ? parseInt(row.bedrooms) : undefined,
        bathrooms: row.bathrooms ? parseInt(row.bathrooms) : undefined,
        area: row.area ? parseFloat(row.area) : undefined,
        propertyType: propertyTypeId,
        status: statusId,
        address: addressId,
        images: images.length > 0 ? images : undefined,
      });

      await property.save();
      imported++;
      console.log(`  ✅ Created property: ${row.title}`);
    } catch (error: any) {
      console.error(
        `  ❌ Error creating property "${row.title}":`,
        error.message,
      );
    }
  }

  console.log(`✅ Imported ${imported} properties\n`);
}

async function clearProperties(
  propertiesModel: Model<MasterPropertiesEntity>,
): Promise<void> {
  console.log('🗑️  Clearing existing properties...\n');

  try {
    const propertiesCount = await propertiesModel.countDocuments().exec();
    if (propertiesCount > 0) {
      await propertiesModel.deleteMany({}).exec();
      console.log(`  ✅ Deleted ${propertiesCount} properties\n`);
    } else {
      console.log('  ℹ️  No properties to delete\n');
    }
  } catch (error: any) {
    console.error('❌ Error clearing properties:', error.message);
    throw error;
  }
}

async function clearAllData(
  propertiesModel: Model<MasterPropertiesEntity>,
  addressModel: Model<MasterAddressEntity>,
  typeModel: Model<MasterPropertiesTypeEntity>,
  statusModel: Model<MasterPropertiesStatusEntity>,
  cityModel: Model<MasterCityEntity>,
): Promise<void> {
  console.log('🗑️  Clearing existing data...\n');

  try {
    // Delete in reverse order of dependencies
    // 1. Properties (depends on address, type, status)
    const propertiesCount = await propertiesModel.countDocuments().exec();
    if (propertiesCount > 0) {
      await propertiesModel.deleteMany({}).exec();
      console.log(`  ✅ Deleted ${propertiesCount} properties`);
    }

    // 2. Addresses (depends on city)
    const addressesCount = await addressModel.countDocuments().exec();
    if (addressesCount > 0) {
      await addressModel.deleteMany({}).exec();
      console.log(`  ✅ Deleted ${addressesCount} addresses`);
    }

    // 3. Types
    const typesCount = await typeModel.countDocuments().exec();
    if (typesCount > 0) {
      await typeModel.deleteMany({}).exec();
      console.log(`  ✅ Deleted ${typesCount} property types`);
    }

    // 4. Statuses
    const statusesCount = await statusModel.countDocuments().exec();
    if (statusesCount > 0) {
      await statusModel.deleteMany({}).exec();
      console.log(`  ✅ Deleted ${statusesCount} property statuses`);
    }

    // 5. Cities (no dependencies)
    const citiesCount = await cityModel.countDocuments().exec();
    if (citiesCount > 0) {
      await cityModel.deleteMany({}).exec();
      console.log(`  ✅ Deleted ${citiesCount} cities`);
    }

    console.log('✅ All existing data cleared\n');
  } catch (error: any) {
    console.error('❌ Error clearing data:', error.message);
    throw error;
  }
}

async function bootstrap() {
  console.log('🚀 Starting mockup data import...\n');

  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    // Get models
    const cityModel = app.get<Model<MasterCityEntity>>(
      getModelToken(MasterCityEntity.name),
    );
    const addressModel = app.get<Model<MasterAddressEntity>>(
      getModelToken(MasterAddressEntity.name),
    );
    const statusModel = app.get<Model<MasterPropertiesStatusEntity>>(
      getModelToken(MasterPropertiesStatusEntity.name),
    );
    const typeModel = app.get<Model<MasterPropertiesTypeEntity>>(
      getModelToken(MasterPropertiesTypeEntity.name),
    );
    const propertiesModel = app.get<Model<MasterPropertiesEntity>>(
      getModelToken(MasterPropertiesEntity.name),
    );

    // Check if master data exists, if not import them first
    const existingCities = await cityModel.countDocuments().exec();
    const existingStatuses = await statusModel.countDocuments().exec();
    const existingTypes = await typeModel.countDocuments().exec();
    const existingAddresses = await addressModel.countDocuments().exec();

    if (
      existingCities === 0 ||
      existingStatuses === 0 ||
      existingTypes === 0 ||
      existingAddresses === 0
    ) {
      // Import master data first if missing
      const cityCodeToIdMap = await importCities(cityModel);
      await importStatuses(statusModel);
      await importTypes(typeModel);
      await importAddresses(addressModel, cityCodeToIdMap);
    }

    // Clear only properties and import new ones
    await clearProperties(propertiesModel);
    await importProperties(propertiesModel, typeModel, statusModel, addressModel);

    console.log('✅ All mockup data imported successfully!');
  } catch (error) {
    console.error('❌ Error importing mockup data:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
