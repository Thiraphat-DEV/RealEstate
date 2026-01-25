import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ViewHistoryController } from './controller/view-history.controller';
import { ViewHistoryService } from './service/view-history.service';
import {
  SystemUserViewHistoryEntity,
  SystemUserViewHistorySchema
} from '../schema/systems/user-view-history.entity';
import {
  MasterPropertiesEntity,
  MasterPropertiesSchema
} from '../schema/master/ms_properties.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SystemUserViewHistoryEntity.name,
        schema: SystemUserViewHistorySchema
      },
      { name: MasterPropertiesEntity.name, schema: MasterPropertiesSchema }
    ])
  ],
  controllers: [ViewHistoryController],
  providers: [ViewHistoryService],
  exports: [ViewHistoryService]
})
export class ViewHistoryModule {}
