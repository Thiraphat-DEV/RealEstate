import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { StandardFields } from '../../../utils/standard-field';
import { UserEntity } from '../user.entity';

export type FavouritesPropertyDocument =
  HydratedDocument<FavouritesPropertyEntity>;

@Schema({ timestamps: true, collection: 'ss_favourites_properties' })
export class FavouritesPropertyEntity extends StandardFields {
  @Prop({ required: true, index: true, ref: UserEntity.name })
  userId: Types.ObjectId;
}

export const FavouritesPropertySchema = SchemaFactory.createForClass(
  FavouritesPropertyEntity
);
