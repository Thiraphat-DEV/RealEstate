import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CountryService } from './country.service';
import { MasterCityEntity } from 'src/modules/schema/master/ms_city.entity';
import { Types } from 'mongoose';

describe('CountryService', () => {
  let service: CountryService;
  let masterCityModel: any;

  const mockCities = [
    {
      _id: new Types.ObjectId(),
      code: 'BKK',
      name: 'Bangkok',
      province: 'Bangkok',
      country: 'Thailand'
    },
    {
      _id: new Types.ObjectId(),
      code: 'CM',
      name: 'Chiang Mai',
      province: 'Chiang Mai',
      country: 'Thailand'
    },
    {
      _id: new Types.ObjectId(),
      code: 'NY',
      name: 'New York',
      province: 'New York',
      country: 'USA'
    }
  ];

  const mockMasterCityModel = {
    find: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountryService,
        {
          provide: getModelToken(MasterCityEntity.name),
          useValue: mockMasterCityModel
        }
      ]
    }).compile();

    service = module.get<CountryService>(CountryService);
    masterCityModel = module.get(getModelToken(MasterCityEntity.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCountries', () => {
    it('should return unique countries', async () => {
      mockMasterCityModel.find.mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockCities)
          })
        })
      });

      const result = await service.getCountries();

      expect(result.statusCode).toBe(200);
      expect(result.data).toContain('Thailand');
      expect(result.data).toContain('USA');
      expect(result.data.length).toBe(2);
    });

    it('should return sorted countries', async () => {
      mockMasterCityModel.find.mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockCities)
          })
        })
      });

      const result = await service.getCountries();

      expect(result.data[0]).toBe('Thailand');
      expect(result.data[1]).toBe('USA');
    });

    it('should return Thailand as fallback when no countries', async () => {
      mockMasterCityModel.find.mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([])
          })
        })
      });

      const result = await service.getCountries();

      expect(result.statusCode).toBe(200);
      expect(result.data).toEqual(['Thailand']);
    });

    it('should handle errors', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      mockMasterCityModel.find.mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockRejectedValue(new Error('Database error'))
          })
        })
      });

      const result = await service.getCountries();

      expect(result.statusCode).toBe(500);
      expect(result.error).toBeDefined();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('getCities', () => {
    it('should return all cities', async () => {
      mockMasterCityModel.find.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockCities)
        })
      });

      const result = await service.getCities();

      expect(result.statusCode).toBe(200);
      expect(result.data).toHaveLength(3);
      expect(result.data[0].id).toBeDefined();
      expect(result.data[0].name).toBe('Bangkok');
    });

    it('should format city data correctly', async () => {
      mockMasterCityModel.find.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([mockCities[0]])
        })
      });

      const result = await service.getCities();

      expect(result.data[0]).toEqual({
        id: mockCities[0]._id.toString(),
        code: 'BKK',
        name: 'Bangkok',
        province: 'Bangkok',
        country: 'Thailand'
      });
    });

    it('should return empty array when no cities', async () => {
      mockMasterCityModel.find.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([])
        })
      });

      const result = await service.getCities();

      expect(result.statusCode).toBe(200);
      expect(result.data).toHaveLength(0);
    });

    it('should handle errors', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      mockMasterCityModel.find.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue(new Error('Database error'))
        })
      });

      const result = await service.getCities();

      expect(result.statusCode).toBe(500);
      expect(result.error).toBeDefined();

      consoleErrorSpy.mockRestore();
    });
  });
});
