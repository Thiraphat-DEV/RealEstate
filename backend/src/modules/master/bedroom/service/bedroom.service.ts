import { Injectable } from '@nestjs/common';
import { ResponseHelper, ServiceResponse } from 'src/common';

@Injectable()
export class BedroomService {
  async getBedroomOptions(): Promise<ServiceResponse<number[]>> {
    try {
      // Static master for bedroom options (1+ to 4+)
      const data = [1, 2, 3, 4];
      return ResponseHelper<number[]>(data, 200, null);
    } catch (error) {
      console.error('BedroomService - Error fetching bedroom options:', error);
      return ResponseHelper<number[] | null>(null, 500, error);
    }
  }
}
