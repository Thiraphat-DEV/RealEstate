import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { StandardFields } from '../../../utils/standard-field';

export type MasterPropertiesTypeDocument =
  HydratedDocument<MasterPropertiesTypeEntity>;

@Schema({ timestamps: true, collection: 'ms_properties_type' })
export class MasterPropertiesTypeEntity extends StandardFields {
  @Prop({ required: true, trim: true })
  code: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: Number, default: 0 })
  sortMaster?: number;
}

export const MasterPropertiesTypeSchema = SchemaFactory.createForClass(
  MasterPropertiesTypeEntity
);

MasterPropertiesTypeSchema.pre('save', async function (next) {
  if (this.isNew && !this.sortMaster) {
    try {
      const Model = this.db.model(
        MasterPropertiesTypeEntity.name,
        MasterPropertiesTypeSchema
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
