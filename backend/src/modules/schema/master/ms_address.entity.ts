import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { StandardFields } from '../../../utils/standard-field';
import { MasterCityEntity } from './ms_city.entity';

export type MasterAddressDocument = HydratedDocument<MasterAddressEntity>;

@Schema({ timestamps: true, collection: 'ms_address' })
export class MasterAddressEntity extends StandardFields {
  @Prop({ required: true, trim: true })
  address: string;

  @Prop({ required: true, type: Types.ObjectId, ref: MasterCityEntity.name })
  city: Types.ObjectId;

  @Prop({ type: String, trim: true })
  district?: string;

  @Prop({ type: String, trim: true })
  subDistrict?: string;

  @Prop({ type: String, trim: true })
  postalCode?: string;

  @Prop({ type: Number })
  latitude?: number;

  @Prop({ type: Number })
  longitude?: number;
}

export const MasterAddressSchema =
  SchemaFactory.createForClass(MasterAddressEntity);
