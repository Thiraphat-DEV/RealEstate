import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseHelper, ServiceResponse } from 'src/common';
import {
  MasterPropertiesTypeDocument,
  MasterPropertiesTypeEntity
} from 'src/modules/schema/master/ms_properties_type.entity';

export interface PropertyTypeMaster {
  id: string;
  code: string;
  name: string;
}

@Injectable()
export class PropertyTypeService {
  constructor(
    @InjectModel(MasterPropertiesTypeEntity.name)
    private readonly masterPropertiesTypeModel: Model<MasterPropertiesTypeDocument>
  ) {}

  async getPropertyTypes(): Promise<ServiceResponse<PropertyTypeMaster[]>> {
    try {
      const result = await this.masterPropertiesTypeModel
        .find({})
        .sort({ sortMaster: 1, name: 1 })
        .lean()
        .exec();

      const data: PropertyTypeMaster[] = (result || []).map((item: any) => ({
        id: item._id?.toString?.() || String(item._id),
        code: item.code,
        name: item.name
      }));

      return ResponseHelper<PropertyTypeMaster[]>(data, 200, null);
    } catch (error) {
      console.error(
        'PropertyTypeService - Error fetching property types:',
        error
      );
      return ResponseHelper<PropertyTypeMaster[] | null>(null, 500, error);
    }
  }
}
