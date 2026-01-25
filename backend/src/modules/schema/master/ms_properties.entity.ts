import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { StandardFields } from '../../../utils/standard-field';
import { MasterPropertiesTypeEntity } from './ms_properties_type.entity';
import { MasterPropertiesStatusEntity } from './ms_properties_status.entity';
import { MasterAddressEntity } from './ms_address.entity';

export type MasterPropertiesDocument = HydratedDocument<MasterPropertiesEntity>;

@Schema({ timestamps: true, collection: 'ms_properties' })
export class MasterPropertiesEntity extends StandardFields {
  @Prop({ required: true, trim: true, index: true })
  title: string;

  @Prop({ required: true, type: Number, min: 0, index: true })
  price: number;

  @Prop({ required: true, trim: true, index: true })
  location: string;

  @Prop({ type: String, trim: true })
  description?: string;

  @Prop({ type: Number, min: 0 })
  bedrooms?: number;

  @Prop({ type: Number, min: 0 })
  bathrooms?: number;

  @Prop({ type: Number, min: 0 })
  area?: number; // in ตารางเมตร

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: MasterPropertiesTypeEntity.name
  })
  propertyType: Types.ObjectId;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: MasterPropertiesStatusEntity.name
  })
  status: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  images?: string[];

  @Prop({ type: Types.ObjectId, ref: MasterAddressEntity.name })
  address?: Types.ObjectId;
}

export const MasterPropertiesSchema = SchemaFactory.createForClass(
  MasterPropertiesEntity
);
