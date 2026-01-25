import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { StandardFields } from '../../../utils/standard-field';
import { UserEntity } from '../user.entity';

export type SystemInquiryDocument = HydratedDocument<SystemInquiryEntity>;

@Schema({ timestamps: true, collection: 'ss_inquiries' })
export class SystemInquiryEntity extends StandardFields {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  email: string;

  @Prop({ required: false, type: String })
  phone?: string;

  @Prop({ required: true, type: String })
  question: string;

  @Prop({ required: false, type: String, default: 'pending' })
  status?: string;

  @Prop({ required: false, type: Types.ObjectId, ref: UserEntity.name })
  userId: Types.ObjectId;
}

export const SystemInquirySchema =
  SchemaFactory.createForClass(SystemInquiryEntity);
