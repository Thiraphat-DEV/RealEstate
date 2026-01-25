import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { StandardFields } from '../../../utils/standard-field';
import { MasterPropertiesEntity } from '../master/ms_properties.entity';
import { UserEntity } from '../user.entity';

export type PropertyReviewDocument = HydratedDocument<PropertyReviewEntity>;

@Schema({ timestamps: true, collection: 'ss_property_reviews' })
export class PropertyReviewEntity extends StandardFields {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: MasterPropertiesEntity.name,
    index: true
  })
  propertyId: Types.ObjectId;

  // เอาไว้ทำระบบจองเเล้วให้มีการรีวิว
  // @Prop({
  //   required: false,
  //   type: Types.ObjectId,
  //   ref: UserEntity.name,
  //   index: true,
  // })
  // userId: Types.ObjectId;

  @Prop({ required: true, type: Number, min: 1, max: 5 })
  rating: number;

  @Prop({ type: String, trim: true })
  comment?: string;

  @Prop({ type: String, default: 'active' })
  status?: string;
}

export const PropertyReviewSchema =
  SchemaFactory.createForClass(PropertyReviewEntity);
