import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { StandardFields } from '../../utils/standard-field';

// Mongoose Schema
export type UserDocument = HydratedDocument<UserEntity>;

@Schema({ timestamps: true, collection: 'users' })
export class UserEntity extends StandardFields {
  @Prop({ required: true, unique: true, trim: true, index: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ unique: true, sparse: true, index: true })
  keycloakID: string;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
