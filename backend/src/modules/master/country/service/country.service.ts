import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseHelper, ServiceResponse } from 'src/common';
import {
  MasterCityDocument,
  MasterCityEntity
} from 'src/modules/schema/master/ms_city.entity';

export interface CityMaster {
  id: string;
  code: string;
  name: string;
  province?: string;
  country?: string;
}

@Injectable()
export class CountryService {
  constructor(
    @InjectModel(MasterCityEntity.name)
    private readonly masterCityModel: Model<MasterCityDocument>
  ) {}

  async getCountries(): Promise<ServiceResponse<string[]>> {
    try {
      const result = await this.masterCityModel
        .find({})
        .select('country')
        .lean()
        .exec();

      const countrySet = new Set<string>();

      for (const item of result || []) {
        const country = (item as any).country;
        if (country && typeof country === 'string') {
          countrySet.add(country);
        }
      }

      // Fallback to Thailand if no countries are configured
      if (countrySet.size === 0) {
        countrySet.add('Thailand');
      }

      const data = Array.from(countrySet).sort();

      return ResponseHelper<string[]>(data, 200, null);
    } catch (error) {
      console.error('CountryService - Error fetching countries:', error);
      return ResponseHelper<string[] | null>(null, 500, error);
    }
  }

  async getCities(): Promise<ServiceResponse<CityMaster[]>> {
    try {
      const result = await this.masterCityModel.find({}).lean().exec();

      const data: CityMaster[] = (result || []).map((item: any) => ({
        id: item._id?.toString?.() || String(item._id),
        code: item.code,
        name: item.name,
        province: item.province,
        country: item.country
      }));

      return ResponseHelper<CityMaster[]>(data, 200, null);
    } catch (error) {
      console.error('CountryService - Error fetching cities:', error);
      return ResponseHelper<CityMaster[] | null>(null, 500, error);
    }
  }
}
