import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ResponseHelper, ServiceResponse } from 'src/common';
import {
  MasterAddressDocument,
  MasterAddressEntity
} from 'src/modules/schema/master/ms_address.entity';
import {
  MasterCityDocument,
  MasterCityEntity
} from 'src/modules/schema/master/ms_city.entity';

export interface AddressMaster {
  id: string;
  address: string;
  cityId?: string;
  cityName?: string;
  district?: string;
  subDistrict?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface AddressFilter {
  city?: string;
  area?: string;
}

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(MasterAddressEntity.name)
    private readonly masterAddressModel: Model<MasterAddressDocument>,
    @InjectModel(MasterCityEntity.name)
    private readonly masterCityModel: Model<MasterCityDocument>
  ) {}

  async getAddresses(
    filter: AddressFilter
  ): Promise<ServiceResponse<AddressMaster[]>> {
    try {
      const { city, area } = filter;
      const query: any = {};
      if (city) {
        if (Types.ObjectId.isValid(city)) {
          query.city = new Types.ObjectId(city);
        } else {
          const cityDoc = await this.masterCityModel
            .findOne({
              $or: [{ name: new RegExp(`^${city}$`, 'i') }, { code: city }]
            })
            .exec();

          if (!cityDoc) {
            return ResponseHelper<AddressMaster[]>([], 200, null);
          }

          query.city = cityDoc._id;
        }
      }

      if (area) {
        const areaRegex = new RegExp(area, 'i');
        query.$or = [{ district: areaRegex }, { subDistrict: areaRegex }];
      }

      const result = await this.masterAddressModel
        .find(query)
        .populate('city')
        .lean()
        .exec();

      const data: AddressMaster[] = (result || []).map((item: any) => ({
        id: item._id?.toString?.() || String(item._id),
        address: item.address,
        cityId: item.city?._id?.toString?.(),
        cityName: item.city?.name,
        district: item.district,
        subDistrict: item.subDistrict,
        postalCode: item.postalCode,
        latitude: item.latitude,
        longitude: item.longitude
      }));

      return ResponseHelper<AddressMaster[]>(data, 200, null);
    } catch (error) {
      console.error('AddressService - Error fetching addresses:', error);
      return ResponseHelper<AddressMaster[] | null>(null, 500, error);
    }
  }
}
