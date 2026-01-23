import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { StandardFields } from '../../../utils/standard-field';

export type MasterPropertiesStatusDocument =
  HydratedDocument<MasterPropertiesStatusEntity>;

@Schema({ timestamps: true, collection: 'ms_properties_status' })
export class MasterPropertiesStatusEntity extends StandardFields {
  @Prop({ required: true, type: String, default: 'AVAILABLE' })
  code: string;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ type: Number, default: 0 })
  sortMaster?: number;
}

export const MasterPropertiesStatusSchema = SchemaFactory.createForClass(
  MasterPropertiesStatusEntity
);

MasterPropertiesStatusSchema.pre('save', async function (next) {
  if (this.isNew && !this.sortMaster) {
    try {
      const Model = this.db.model(
        MasterPropertiesStatusEntity.name,
        MasterPropertiesStatusSchema
      );
      const maxDoc = await Model.findOne()
        .sort({ sortMaster: -1 })
        .select('sortMaster')
        .lean()
        .exec();

      this.sortMaster = maxDoc && maxDoc.sortMaster ? maxDoc.sortMaster + 1 : 1;
    } catch (error) {
      // set default is 1 for sortMaster if error
      this.sortMaster = 1;
    }
  }
  next();
});
