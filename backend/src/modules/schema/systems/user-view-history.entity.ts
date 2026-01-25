import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { StandardFields } from '../../../utils/standard-field';
import { MasterPropertiesEntity } from '../master/ms_properties.entity';
import { UserEntity } from '../user.entity';

export type SystemUserViewHistoryDocument =
  HydratedDocument<SystemUserViewHistoryEntity>;

@Schema({ timestamps: true, collection: 'ss_user_view_history' })
export class SystemUserViewHistoryEntity extends StandardFields {
  @Prop({
    required: false,
    type: Types.ObjectId,
    ref: MasterPropertiesEntity.name,
    index: true
  })
  propertyId: Types.ObjectId;

  @Prop({ required: false, type: Types.ObjectId, ref: UserEntity.name })
  userId: Types.ObjectId;
}

export const SystemUserViewHistorySchema = SchemaFactory.createForClass(
  SystemUserViewHistoryEntity
);
