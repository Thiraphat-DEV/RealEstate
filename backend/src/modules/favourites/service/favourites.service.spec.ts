import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { FavouritesService } from './favourites.service';
import { FavouritesPropertyEntity } from '../../schema/systems/favourite-property.entity';
import { MasterPropertiesEntity } from '../../schema/master/ms_properties.entity';
import { Types } from 'mongoose';

describe('FavouritesService', () => {
  let service: FavouritesService;
  let favouritesModel: jest.Mocked<any>;
  let masterPropertiesModel: jest.Mocked<any>;

  // Test constants
  const TEST_USER_ID = '507f1f77bcf86cd799439011';

  // Mock data factories
  const createMockFavourite = (overrides = {}) => ({
    _id: new Types.ObjectId(),
    userId: new Types.ObjectId(TEST_USER_ID),
    propertyId: new Types.ObjectId(),
    createBy: TEST_USER_ID,
    updateBy: TEST_USER_ID,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  });

  const createMockProperty = (overrides = {}) => ({
    _id: new Types.ObjectId(),
    title: 'Test Property',
    price: 1000000,
    location: 'Bangkok',
    bedrooms: 2,
    bathrooms: 1,
    area: 50,
    ...overrides
  });

  beforeEach(async () => {
    const MockFavouriteModel = jest.fn().mockImplementation((data) => ({
      ...data,
      save: jest.fn().mockResolvedValue(true)
    }));

    // Create mock model with constructor and methods
    const mockFavouritesModel = Object.assign(MockFavouriteModel, {
      findOne: jest.fn(),
      find: jest.fn(),
      deleteOne: jest.fn(),
      exists: jest.fn()
    }) as any;

    const mockMasterPropertiesModel = {
      exists: jest.fn(),
      find: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavouritesService,
        {
          provide: getModelToken(FavouritesPropertyEntity.name),
          useValue: mockFavouritesModel
        },
        {
          provide: getModelToken(MasterPropertiesEntity.name),
          useValue: mockMasterPropertiesModel
        }
      ]
    }).compile();

    service = module.get<FavouritesService>(FavouritesService);
    favouritesModel = module.get(getModelToken(FavouritesPropertyEntity.name));
    masterPropertiesModel = module.get(
      getModelToken(MasterPropertiesEntity.name)
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toggleFavourite', () => {
    const userId = TEST_USER_ID;

    describe('Remove favourite', () => {
      it('should remove favourite when it exists', async () => {
        // Arrange
        const propertyId = new Types.ObjectId().toString();
        const mockFavourite = createMockFavourite();
        favouritesModel.findOne.mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockFavourite)
        });
        favouritesModel.deleteOne.mockReturnValue({
          exec: jest.fn().mockResolvedValue({ deletedCount: 1 })
        });

        // Act
        const result = await service.toggleFavourite(userId, propertyId);

        // Assert
        expect(result.statusCode).toBe(200);
        expect(result.data).toEqual({ isFavourite: false });
        expect(favouritesModel.findOne).toHaveBeenCalledWith({
          userId: new Types.ObjectId(userId),
          propertyId: new Types.ObjectId(propertyId)
        });
        expect(favouritesModel.deleteOne).toHaveBeenCalled();
      });
    });

    describe('Add favourite', () => {
      it('should add favourite when it does not exist', async () => {
        // Arrange
        const propertyId = new Types.ObjectId().toString();
        const mockProperty = createMockProperty({
          _id: new Types.ObjectId(propertyId)
        });
        favouritesModel.findOne.mockReturnValue({
          exec: jest.fn().mockResolvedValue(null)
        });
        masterPropertiesModel.exists.mockReturnValue({
          exec: jest.fn().mockResolvedValue(true)
        });
        const newFavourite = {
          ...createMockFavourite(),
          save: jest.fn().mockResolvedValue(true)
        };
        // Mock constructor is already set in beforeEach
        (favouritesModel as any).mockImplementation(() => newFavourite);

        // Act
        const result = await service.toggleFavourite(userId, propertyId);

        // Assert
        expect(result.statusCode).toBe(201);
        expect(result.data).toEqual({ isFavourite: true });
        expect(masterPropertiesModel.exists).toHaveBeenCalledWith({
          _id: new Types.ObjectId(propertyId)
        });
      });
    });

    describe('Validation', () => {
      it('should return 400 for invalid property id', async () => {
        // Arrange
        const invalidPropertyId = 'invalid-id';

        // Act
        const result = await service.toggleFavourite(userId, invalidPropertyId);

        // Assert
        expect(result.statusCode).toBe(400);
        expect(result.error).toBe('Invalid property id');
        expect(result.data).toBeNull();
      });

      it('should return 404 when property does not exist', async () => {
        // Arrange
        const propertyId = new Types.ObjectId().toString();
        favouritesModel.findOne.mockReturnValue({
          exec: jest.fn().mockResolvedValue(null)
        });
        masterPropertiesModel.exists.mockReturnValue({
          exec: jest.fn().mockResolvedValue(null)
        });

        // Act
        const result = await service.toggleFavourite(userId, propertyId);

        // Assert
        expect(result.statusCode).toBe(404);
        expect(result.error).toBe('Property not found');
      });
    });
  });

  describe('getUserFavourites', () => {
    const userId = TEST_USER_ID;

    it('should return user favourites', async () => {
      // Arrange
      const mockFavourite = createMockFavourite();
      const mockProperty = createMockProperty({
        _id: mockFavourite.propertyId
      });
      const favourites = [mockFavourite];
      const properties = [mockProperty];

      favouritesModel.find.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(favourites)
        })
      });
      masterPropertiesModel.find.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(properties)
        })
      });

      // Act
      const result = await service.getUserFavourites(userId);

      // Assert
      expect(result.statusCode).toBe(200);
      expect(result.data).toHaveLength(1);
      expect(favouritesModel.find).toHaveBeenCalledWith({
        userId: new Types.ObjectId(userId)
      });
    });

    it('should return empty array when no favourites', async () => {
      // Arrange
      favouritesModel.find.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([])
        })
      });

      // Act
      const result = await service.getUserFavourites(userId);

      // Assert
      expect(result.statusCode).toBe(200);
      expect(result.data).toHaveLength(0);
    });

    it('should filter out null propertyIds', async () => {
      // Arrange
      const favourites = [
        createMockFavourite({ propertyId: new Types.ObjectId() }),
        createMockFavourite({ propertyId: null })
      ];
      const properties = [createMockProperty()];

      favouritesModel.find.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(favourites)
        })
      });
      masterPropertiesModel.find.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(properties)
        })
      });

      // Act
      const result = await service.getUserFavourites(userId);

      // Assert
      expect(result.statusCode).toBe(200);
      expect(result.data).toBeDefined();
    });
  });

  describe('isFavourite', () => {
    const userId = TEST_USER_ID;

    it('should return true when property is favourited', async () => {
      // Arrange
      const propertyId = new Types.ObjectId().toString();
      favouritesModel.exists.mockReturnValue({
        exec: jest.fn().mockResolvedValue(true)
      });

      // Act
      const result = await service.isFavourite(userId, propertyId);

      // Assert
      expect(result.statusCode).toBe(200);
      expect(result.data).toEqual({ isFavourite: true });
      expect(favouritesModel.exists).toHaveBeenCalledWith({
        userId: new Types.ObjectId(userId),
        propertyId: new Types.ObjectId(propertyId)
      });
    });

    it('should return false when property is not favourited', async () => {
      // Arrange
      const propertyId = new Types.ObjectId().toString();
      favouritesModel.exists.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null)
      });

      // Act
      const result = await service.isFavourite(userId, propertyId);

      // Assert
      expect(result.statusCode).toBe(200);
      expect(result.data).toEqual({ isFavourite: false });
    });

    it('should return 400 for invalid property id', async () => {
      // Arrange
      const invalidPropertyId = 'invalid-id';

      // Act
      const result = await service.isFavourite(userId, invalidPropertyId);

      // Assert
      expect(result.statusCode).toBe(400);
      expect(result.error).toBe('Invalid property id');
      expect(result.data).toBeNull();
    });
  });
});
