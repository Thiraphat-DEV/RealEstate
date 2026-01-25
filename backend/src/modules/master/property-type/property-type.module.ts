import { Module } from '@nestjs/common';
import { MasterSchemaModule } from '../../schema/master/master-schema.module';
import { PropertyTypeService } from './service/property-type.service';
import { PropertyTypeController } from './controller/property-type.controller';

@Module({
  imports: [MasterSchemaModule],
  providers: [PropertyTypeService],
  controllers: [PropertyTypeController],
  exports: [PropertyTypeService]
})
export class PropertyTypeModule {}
