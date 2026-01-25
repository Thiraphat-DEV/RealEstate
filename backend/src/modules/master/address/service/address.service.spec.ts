import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AddressService } from './address.service';
import { MasterAddressEntity } from 'src/modules/schema/master/ms_address.entity';
import { MasterCityEntity } from 'src/modules/schema/master/ms_city.entity';
import { Types } from 'mongoose';

describe('AddressService', () => {
  let service: AddressService;
  let masterAddressModel: any;
  let masterCityModel: any;

  const mockAddress = {
    _id: new Types.ObjectId(),
    address: '123 Main St',
    district: 'District 1',
    subDistrict: 'Sub District 1',
    postalCode: '10100',
    latitude: 13.7563,
    longitude: 100.5018,
    city: {
      _id: new Types.ObjectId(),
      name: 'Bangkok',
      province: 'Bangkok',
      country: 'Thailand'
    }
  };

  const mockCity = {
    _id: new Types.ObjectId(),
    name: 'Bangkok',
    code: 'BKK',
    province: 'Bangkok',
    country: 'Thailand'
  };

  const mockMasterAddressModel = {
    find: jest.fn()
  };

  const mockMasterCityModel = {
    findOne: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        {
          provide: getModelToken(MasterAddressEntity.name),
          useValue: mockMasterAddressModel
        },
        {
          provide: getModelToken(MasterCityEntity.name),
          useValue: mockMasterCityModel
        }
      ]
    }).compile();

    service = module.get<AddressService>(AddressService);
    masterAddressModel = module.get(getModelToken(MasterAddressEntity.name));
    masterCityModel = module.get(getModelToken(MasterCityEntity.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAddresses', () => {
    it('should return all addresses when no filter', async () => {
      const addresses = [mockAddress];

      masterAddressModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(addresses)
          })
        })
      });

      const result = await service.getAddresses({});

      expect(result.statusCode).toBe(200);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBeDefined();
      expect(result.data[0].address).toBe('123 Main St');
    });

    it('should filter by city ObjectId', async () => {
      const cityId = new Types.ObjectId().toString();
      const addresses = [mockAddress];

      masterAddressModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(addresses)
          })
        })
      });

      const result = await service.getAddresses({ city: cityId });

      expect(result.statusCode).toBe(200);
      expect(masterAddressModel.find).toHaveBeenCalled();
    });

    it('should filter by city name', async () => {
      const addresses = [mockAddress];

      masterCityModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCity)
      });
      masterAddressModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(addresses)
          })
        })
      });

      const result = await service.getAddresses({ city: 'Bangkok' });

      expect(result.statusCode).toBe(200);
      expect(masterCityModel.findOne).toHaveBeenCalled();
    });

    it('should return empty array when city not found', async () => {
      masterCityModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null)
      });

      const result = await service.getAddresses({ city: 'NonExistent' });

      expect(result.statusCode).toBe(200);
      expect(result.data).toHaveLength(0);
    });

    it('should filter by area (district or subDistrict)', async () => {
      const addresses = [mockAddress];

      masterAddressModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(addresses)
          })
        })
      });

      const result = await service.getAddresses({ area: 'District' });

      expect(result.statusCode).toBe(200);
      expect(masterAddressModel.find).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      masterAddressModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockRejectedValue(new Error('Database error'))
          })
        })
      });

      const result = await service.getAddresses({});

      expect(result.statusCode).toBe(500);
      expect(result.error).toBeDefined();

      consoleErrorSpy.mockRestore();
    });
  });
});
