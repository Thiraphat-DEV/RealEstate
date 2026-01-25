import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { PropertyTypeService } from './property-type.service';
import { MasterPropertiesTypeEntity } from 'src/modules/schema/master/ms_properties_type.entity';
import { Types } from 'mongoose';

describe('PropertyTypeService', () => {
  let service: PropertyTypeService;
  let masterPropertiesTypeModel: any;

  const mockPropertyTypes = [
    {
      _id: new Types.ObjectId(),
      code: 'HOUSE',
      name: 'House',
      sortMaster: 1
    },
    {
      _id: new Types.ObjectId(),
      code: 'CONDO',
      name: 'Condominium',
      sortMaster: 2
    },
    {
      _id: new Types.ObjectId(),
      code: 'APARTMENT',
      name: 'Apartment',
      sortMaster: 3
    }
  ];

  const mockMasterPropertiesTypeModel = {
    find: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertyTypeService,
        {
          provide: getModelToken(MasterPropertiesTypeEntity.name),
          useValue: mockMasterPropertiesTypeModel
        }
      ]
    }).compile();

    service = module.get<PropertyTypeService>(PropertyTypeService);
    masterPropertiesTypeModel = module.get(
      getModelToken(MasterPropertiesTypeEntity.name)
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPropertyTypes', () => {
    it('should return all property types sorted', async () => {
      mockMasterPropertiesTypeModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockPropertyTypes)
          })
        })
      });

      const result = await service.getPropertyTypes();

      expect(result.statusCode).toBe(200);
      expect(result.data).toHaveLength(3);
      expect(result.data[0].code).toBe('HOUSE');
    });

    it('should format property type data correctly', async () => {
      mockMasterPropertiesTypeModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([mockPropertyTypes[0]])
          })
        })
      });

      const result = await service.getPropertyTypes();

      expect(result.data[0]).toEqual({
        id: mockPropertyTypes[0]._id.toString(),
        code: 'HOUSE',
        name: 'House'
      });
    });

    it('should sort by sortMaster and name', async () => {
      mockMasterPropertiesTypeModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockPropertyTypes)
          })
        })
      });

      await service.getPropertyTypes();

      expect(mockMasterPropertiesTypeModel.find().sort).toHaveBeenCalledWith({
        sortMaster: 1,
        name: 1
      });
    });

    it('should return empty array when no property types', async () => {
      mockMasterPropertiesTypeModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([])
          })
        })
      });

      const result = await service.getPropertyTypes();

      expect(result.statusCode).toBe(200);
      expect(result.data).toHaveLength(0);
    });

    it('should handle errors', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      mockMasterPropertiesTypeModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockRejectedValue(new Error('Database error'))
          })
        })
      });

      const result = await service.getPropertyTypes();

      expect(result.statusCode).toBe(500);
      expect(result.error).toBeDefined();

      consoleErrorSpy.mockRestore();
    });
  });
});
