import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { PropertiesService } from './properties.service';
import { MasterPropertiesEntity } from 'src/modules/schema/master/ms_properties.entity';
import { Types } from 'mongoose';
import { GetPropertiesFilterDTO } from '../dto';

describe('PropertiesService', () => {
  let service: PropertiesService;
  let masterPropertiesModel: jest.Mocked<any>;

  // Test constants
  const DEFAULT_PAGE = 1;
  const DEFAULT_PAGE_LIMIT = 20;

  // Mock data factories
  const createMockProperty = (overrides = {}) => ({
    _id: new Types.ObjectId(),
    title: 'Test Property',
    price: 1000000,
    location: 'Bangkok',
    bedrooms: 2,
    bathrooms: 1,
    area: 50,
    images: ['image1.jpg'],
    propertyType: new Types.ObjectId(),
    status: new Types.ObjectId(),
    address: new Types.ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  });

  const createMockPropertyResult = (property: any) => ({
    ...property,
    _id: property._id.toString(),
    propertyType: property.propertyType.toString(),
    status: property.status.toString(),
    address: property.address.toString()
  });

  beforeEach(async () => {
    const mockMasterPropertiesModel = {
      aggregate: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertiesService,
        {
          provide: getModelToken(MasterPropertiesEntity.name),
          useValue: mockMasterPropertiesModel
        }
      ]
    }).compile();

    service = module.get<PropertiesService>(PropertiesService);
    masterPropertiesModel = module.get(
      getModelToken(MasterPropertiesEntity.name)
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProperties', () => {
    describe('Default behavior', () => {
      it('should return all properties with default pagination', async () => {
        // Arrange
        const mockProperties = [
          createMockProperty({ title: 'Property 1' }),
          createMockProperty({ title: 'Property 2' })
        ];
        const mockCountResult = [{ total: 2 }];
        const mockDataResult = mockProperties.map(createMockPropertyResult);

        masterPropertiesModel.aggregate
          .mockReturnValueOnce({
            exec: jest.fn().mockResolvedValue(mockCountResult)
          })
          .mockReturnValueOnce({
            exec: jest.fn().mockResolvedValue(mockDataResult)
          });

        // Act
        const result = await service.getAllProperties({});

        // Assert
        expect(result.statusCode).toBe(200);
        expect(result.data).toHaveLength(2);
        expect(result.metadata).toEqual({
          total: 2,
          page: DEFAULT_PAGE,
          pageLimit: DEFAULT_PAGE_LIMIT,
          totalPages: 1
        });
        expect(masterPropertiesModel.aggregate).toHaveBeenCalledTimes(2);
      });

      it('should handle empty results', async () => {
        // Arrange
        const mockCountResult = [{ total: 0 }];
        const mockDataResult: any[] = [];

        masterPropertiesModel.aggregate
          .mockReturnValueOnce({
            exec: jest.fn().mockResolvedValue(mockCountResult)
          })
          .mockReturnValueOnce({
            exec: jest.fn().mockResolvedValue(mockDataResult)
          });

        // Act
        const result = await service.getAllProperties({});

        // Assert
        expect(result.statusCode).toBe(200);
        expect(result.data).toHaveLength(0);
        expect(result.metadata.total).toBe(0);
      });
    });

    describe('Filtering', () => {
      it('should filter by address', async () => {
        // Arrange
        const addressId = new Types.ObjectId();
        const query: GetPropertiesFilterDTO = {
          address: addressId.toString()
        };
        const mockCountResult = [{ total: 1 }];
        const mockDataResult = [createMockPropertyResult(createMockProperty())];

        masterPropertiesModel.aggregate
          .mockReturnValueOnce({
            exec: jest.fn().mockResolvedValue(mockCountResult)
          })
          .mockReturnValueOnce({
            exec: jest.fn().mockResolvedValue(mockDataResult)
          });

        // Act
        const result = await service.getAllProperties(query);

        // Assert
        expect(result.statusCode).toBe(200);
        expect(result.data).toHaveLength(1);
      });

      it('should filter by propertyType', async () => {
        // Arrange
        const propertyTypeId = new Types.ObjectId();
        const query: GetPropertiesFilterDTO = {
          propertyType: propertyTypeId.toString()
        };
        const mockCountResult = [{ total: 1 }];
        const mockDataResult = [createMockPropertyResult(createMockProperty())];

        masterPropertiesModel.aggregate
          .mockReturnValueOnce({
            exec: jest.fn().mockResolvedValue(mockCountResult)
          })
          .mockReturnValueOnce({
            exec: jest.fn().mockResolvedValue(mockDataResult)
          });

        // Act
        const result = await service.getAllProperties(query);

        // Assert
        expect(result.statusCode).toBe(200);
      });

      it('should filter by price range', async () => {
        // Arrange
        const query: GetPropertiesFilterDTO = {
          priceMin: 500000,
          priceMax: 1500000
        };
        const mockCountResult = [{ total: 1 }];
        const mockDataResult = [createMockPropertyResult(createMockProperty())];

        masterPropertiesModel.aggregate
          .mockReturnValueOnce({
            exec: jest.fn().mockResolvedValue(mockCountResult)
          })
          .mockReturnValueOnce({
            exec: jest.fn().mockResolvedValue(mockDataResult)
          });

        // Act
        const result = await service.getAllProperties(query);

        // Assert
        expect(result.statusCode).toBe(200);
      });

      it('should filter by bedrooms and bathrooms', async () => {
        // Arrange
        const query: GetPropertiesFilterDTO = {
          bedrooms: 2,
          bathrooms: 1
        };
        const mockCountResult = [{ total: 1 }];
        const mockDataResult = [createMockPropertyResult(createMockProperty())];

        masterPropertiesModel.aggregate
          .mockReturnValueOnce({
            exec: jest.fn().mockResolvedValue(mockCountResult)
          })
          .mockReturnValueOnce({
            exec: jest.fn().mockResolvedValue(mockDataResult)
          });

        // Act
        const result = await service.getAllProperties(query);

        // Assert
        expect(result.statusCode).toBe(200);
      });

      it('should filter by area range', async () => {
        // Arrange
        const query: GetPropertiesFilterDTO = {
          areaMin: 40,
          areaMax: 60
        };
        const mockCountResult = [{ total: 1 }];
        const mockDataResult = [createMockPropertyResult(createMockProperty())];

        masterPropertiesModel.aggregate
          .mockReturnValueOnce({
            exec: jest.fn().mockResolvedValue(mockCountResult)
          })
          .mockReturnValueOnce({
            exec: jest.fn().mockResolvedValue(mockDataResult)
          });

        // Act
        const result = await service.getAllProperties(query);

        // Assert
        expect(result.statusCode).toBe(200);
      });

      it('should filter by search term', async () => {
        // Arrange
        const query: GetPropertiesFilterDTO = {
          search: 'Bangkok'
        };
        const mockCountResult = [{ total: 1 }];
        const mockDataResult = [createMockPropertyResult(createMockProperty())];

        masterPropertiesModel.aggregate
          .mockReturnValueOnce({
            exec: jest.fn().mockResolvedValue(mockCountResult)
          })
          .mockReturnValueOnce({
            exec: jest.fn().mockResolvedValue(mockDataResult)
          });

        // Act
        const result = await service.getAllProperties(query);

        // Assert
        expect(result.statusCode).toBe(200);
      });

      it('should filter by location', async () => {
        // Arrange
        const cityId = new Types.ObjectId();
        const query: GetPropertiesFilterDTO = {
          location: cityId.toString()
        };
        const mockCountResult = [{ total: 1 }];
        const mockDataResult = [createMockPropertyResult(createMockProperty())];

        masterPropertiesModel.aggregate
          .mockReturnValueOnce({
            exec: jest.fn().mockResolvedValue(mockCountResult)
          })
          .mockReturnValueOnce({
            exec: jest.fn().mockResolvedValue(mockDataResult)
          });

        // Act
        const result = await service.getAllProperties(query);

        // Assert
        expect(result.statusCode).toBe(200);
      });

      it('should handle multiple filters combined', async () => {
        // Arrange
        const query: GetPropertiesFilterDTO = {
          priceMin: 500000,
          priceMax: 2000000,
          bedrooms: 2,
          search: 'Bangkok'
        };
        const mockCountResult = [{ total: 1 }];
        const mockDataResult = [createMockPropertyResult(createMockProperty())];

        masterPropertiesModel.aggregate
          .mockReturnValueOnce({
            exec: jest.fn().mockResolvedValue(mockCountResult)
          })
          .mockReturnValueOnce({
            exec: jest.fn().mockResolvedValue(mockDataResult)
          });

        // Act
        const result = await service.getAllProperties(query);

        // Assert
        expect(result.statusCode).toBe(200);
      });
    });

    describe('Pagination', () => {
      it('should handle custom pagination', async () => {
        // Arrange
        const page = 2;
        const pageLimit = 10;
        const total = 50;
        const query: GetPropertiesFilterDTO = { page, pageLimit };
        const mockCountResult = [{ total }];
        const mockDataResult = Array(10)
          .fill(null)
          .map(() => createMockPropertyResult(createMockProperty()));

        masterPropertiesModel.aggregate
          .mockReturnValueOnce({
            exec: jest.fn().mockResolvedValue(mockCountResult)
          })
          .mockReturnValueOnce({
            exec: jest.fn().mockResolvedValue(mockDataResult)
          });

        // Act
        const result = await service.getAllProperties(query);

        // Assert
        expect(result.metadata).toEqual({
          total,
          page,
          pageLimit,
          totalPages: Math.ceil(total / pageLimit)
        });
      });

      it('should use default values for invalid page', async () => {
        // Arrange
        const query: GetPropertiesFilterDTO = { page: -1, pageLimit: 0 };
        const mockCountResult = [{ total: 0 }];
        const mockDataResult: any[] = [];

        masterPropertiesModel.aggregate
          .mockReturnValueOnce({
            exec: jest.fn().mockResolvedValue(mockCountResult)
          })
          .mockReturnValueOnce({
            exec: jest.fn().mockResolvedValue(mockDataResult)
          });

        // Act
        const result = await service.getAllProperties(query);

        // Assert
        expect(result.metadata.page).toBe(DEFAULT_PAGE);
        expect(result.metadata.pageLimit).toBe(DEFAULT_PAGE_LIMIT);
      });

      it('should calculate totalPages correctly', async () => {
        // Arrange
        const total = 25;
        const pageLimit = 10;
        const query: GetPropertiesFilterDTO = { pageLimit };
        const mockCountResult = [{ total }];
        const mockDataResult: any[] = [];

        masterPropertiesModel.aggregate
          .mockReturnValueOnce({
            exec: jest.fn().mockResolvedValue(mockCountResult)
          })
          .mockReturnValueOnce({
            exec: jest.fn().mockResolvedValue(mockDataResult)
          });

        // Act
        const result = await service.getAllProperties(query);

        // Assert
        expect(result.metadata.totalPages).toBe(3); // Math.ceil(25/10) = 3
      });
    });

    describe('Error handling', () => {
      it('should handle database errors gracefully', async () => {
        // Arrange
        const error = new Error('Database connection failed');
        const consoleErrorSpy = jest
          .spyOn(console, 'error')
          .mockImplementation(() => {});
        masterPropertiesModel.aggregate.mockReturnValue({
          exec: jest.fn().mockRejectedValue(error)
        });

        // Act
        const result = await service.getAllProperties({});

        // Assert
        expect(result.statusCode).toBe(500);
        expect(result.error).toBe(error);
        expect(result.data).toBeNull();

        // Cleanup
        consoleErrorSpy.mockRestore();
      });

      it('should handle empty count result', async () => {
        // Arrange
        const mockCountResult: any[] = [];
        const mockDataResult: any[] = [];

        masterPropertiesModel.aggregate
          .mockReturnValueOnce({
            exec: jest.fn().mockResolvedValue(mockCountResult)
          })
          .mockReturnValueOnce({
            exec: jest.fn().mockResolvedValue(mockDataResult)
          });

        // Act
        const result = await service.getAllProperties({});

        // Assert
        expect(result.metadata.total).toBe(0);
      });
    });
  });

  describe('getPropertyById', () => {
    describe('Success cases', () => {
      it('should return property by id', async () => {
        // Arrange
        const propertyId = new Types.ObjectId();
        const mockProperty = createMockProperty({ _id: propertyId });
        const mockResult = [
          {
            ...createMockPropertyResult(mockProperty),
            propertyType: { _id: new Types.ObjectId(), name: 'House' },
            status: { _id: new Types.ObjectId(), name: 'Available' },
            address: {
              _id: new Types.ObjectId(),
              city: { name: 'Bangkok', province: 'Bangkok' }
            }
          }
        ];

        masterPropertiesModel.aggregate.mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockResult)
        });

        // Act
        const result = await service.getPropertyById(propertyId.toString());

        // Assert
        expect(result.statusCode).toBe(200);
        expect(result.data).toBeDefined();
        expect(result.data._id).toBe(propertyId.toString());
      });
    });

    describe('Validation', () => {
      it('should return 400 when id is not provided', async () => {
        // Arrange
        const emptyId = '';

        // Act
        const result = await service.getPropertyById(emptyId);

        // Assert
        expect(result.statusCode).toBe(400);
        expect(result.error).toBe('Property id is required');
        expect(result.data).toBeNull();
      });

      it('should return 400 when id is null', async () => {
        // Act
        const result = await service.getPropertyById(null as any);

        // Assert
        expect(result.statusCode).toBe(400);
      });
    });

    describe('Not found cases', () => {
      it('should return 404 when property not found', async () => {
        // Arrange
        const propertyId = new Types.ObjectId();
        masterPropertiesModel.aggregate.mockReturnValue({
          exec: jest.fn().mockResolvedValue([])
        });

        // Act
        const result = await service.getPropertyById(propertyId.toString());

        // Assert
        expect(result.statusCode).toBe(404);
        expect(result.error).toBe('Property not found');
        expect(result.data).toBeNull();
      });
    });

    describe('Error handling', () => {
      it('should handle database errors', async () => {
        // Arrange
        const propertyId = new Types.ObjectId();
        const error = new Error('Database error');
        const consoleErrorSpy = jest
          .spyOn(console, 'error')
          .mockImplementation(() => {});
        masterPropertiesModel.aggregate.mockReturnValue({
          exec: jest.fn().mockRejectedValue(error)
        });

        // Act
        const result = await service.getPropertyById(propertyId.toString());

        // Assert
        expect(result.statusCode).toBe(500);
        expect(result.error).toBe(error);
        expect(result.data).toBeNull();

        // Cleanup
        consoleErrorSpy.mockRestore();
      });

      it('should handle invalid ObjectId format', async () => {
        // Arrange
        const invalidId = 'invalid-object-id';
        masterPropertiesModel.aggregate.mockReturnValue({
          exec: jest.fn().mockRejectedValue(new Error('Invalid ObjectId'))
        });

        // Act
        const result = await service.getPropertyById(invalidId);

        // Assert
        expect(result.statusCode).toBe(500);
      });
    });
  });
});
