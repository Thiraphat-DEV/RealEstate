import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { StandardFields } from '../../../utils/standard-field';

export type UserTransactionDocument = HydratedDocument<UserTransactionEntity>;

@Schema({ timestamps: true, collection: 'user_transactions' })
export class UserTransactionEntity extends StandardFields {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true, index: true })
  email: string;

  @Prop({ required: true, enum: ['login', 'logout'], index: true })
  action: string;

  @Prop({ type: String })
  ipAddress?: string;

  @Prop({ type: String })
  userAgent?: string;
}

export const UserTransactionSchema = SchemaFactory.createForClass(
  UserTransactionEntity
);
