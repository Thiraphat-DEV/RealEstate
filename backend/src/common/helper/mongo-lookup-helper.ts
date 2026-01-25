import { PipelineStage } from 'mongoose';

export class MongoLookupHelper {
  static getMasterLookupStage(
    tableName: string,
    localField: string
  ): PipelineStage.Lookup['$lookup'] {
    return {
      from: tableName,
      localField: localField,
      foreignField: '_id',
      as: `${localField}`
    };
  }
}
