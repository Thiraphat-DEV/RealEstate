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

    // Import in order: cities first (for address references), then statuses, types, and addresses
    const cityCodeToIdMap = await importCities(cityModel);
    await importStatuses(statusModel);
    await importTypes(typeModel);
    await importAddresses(addressModel, cityCodeToIdMap);

    console.log('✅ All mockup data imported successfully!');
  } catch (error) {
    console.error('❌ Error importing mockup data:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
