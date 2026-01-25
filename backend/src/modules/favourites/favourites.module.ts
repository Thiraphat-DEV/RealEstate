import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FavouritesController } from './controller/favourites.controller';
import { FavouritesService } from './service/favourites.service';
import {
  FavouritesPropertyEntity,
  FavouritesPropertySchema
} from '../schema/systems/favourite-property.entity';
import {
  MasterPropertiesEntity,
  MasterPropertiesSchema
} from '../schema/master/ms_properties.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FavouritesPropertyEntity.name, schema: FavouritesPropertySchema },
      { name: MasterPropertiesEntity.name, schema: MasterPropertiesSchema }
    ])
  ],
  controllers: [FavouritesController],
  providers: [FavouritesService],
  exports: [FavouritesService]
})
export class FavouritesModule {}
