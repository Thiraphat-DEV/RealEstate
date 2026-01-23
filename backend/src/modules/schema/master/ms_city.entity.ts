import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { StandardFields } from '../../../utils/standard-field';

export type MasterCityDocument = HydratedDocument<MasterCityEntity>;

@Schema({ timestamps: true, collection: 'ms_city' })
export class MasterCityEntity extends StandardFields {
  @Prop({ required: true, trim: true, unique: true, index: true })
  code: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  province: string;

  @Prop({ type: String, trim: true })
  postalCode?: string;

  @Prop({ type: String, trim: true })
  country?: string;
}

export const MasterCitySchema = SchemaFactory.createForClass(MasterCityEntity);
