import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MasterPropertiesEntity,
  MasterPropertiesSchema
} from './ms_properties.entity';
import {
  MasterPropertiesTypeEntity,
  MasterPropertiesTypeSchema
} from './ms_properties_type.entity';
import {
  MasterPropertiesStatusEntity,
  MasterPropertiesStatusSchema
} from './ms_properties_status.entity';
import { MasterAddressEntity, MasterAddressSchema } from './ms_address.entity';
import { MasterCityEntity, MasterCitySchema } from './ms_city.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MasterPropertiesEntity.name, schema: MasterPropertiesSchema },
      {
        name: MasterPropertiesTypeEntity.name,
        schema: MasterPropertiesTypeSchema
      },
      {
        name: MasterPropertiesStatusEntity.name,
        schema: MasterPropertiesStatusSchema
      },
      { name: MasterAddressEntity.name, schema: MasterAddressSchema },
      { name: MasterCityEntity.name, schema: MasterCitySchema }
    ])
  ],
  exports: [MongooseModule]
})
export class MasterSchemaModule {}
