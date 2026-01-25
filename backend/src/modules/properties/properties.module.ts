import { Module } from '@nestjs/common';
import { PropertiesController } from './controller/properties.controller';
import { PropertiesService } from './service/properties.service';
import { MasterSchemaModule } from '../schema/master/master-schema.module';

@Module({
  imports: [MasterSchemaModule],
  controllers: [PropertiesController],
  providers: [PropertiesService]
})
export class PropertiesModule {}
