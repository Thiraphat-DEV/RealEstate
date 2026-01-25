import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ViewHistoryService } from './view-history.service';
import { SystemUserViewHistoryEntity } from '../../schema/systems/user-view-history.entity';
import { MasterPropertiesEntity } from '../../schema/master/ms_properties.entity';
import { Types } from 'mongoose';

describe('ViewHistoryService', () => {
  let service: ViewHistoryService;
  let viewHistoryModel: any;
  let masterPropertiesModel: any;

  // Test constants
  const TEST_USER_ID = new Types.ObjectId().toString();

  const mockViewHistory = {
    _id: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    propertyId: new Types.ObjectId(),
    isVoid: false,
    save: jest.fn()
  };

  const mockProperty = {
    _id: new Types.ObjectId(),
    title: 'Test Property',
    price: 1000000,
    location: 'Bangkok'
  };

  beforeEach(async () => {
    const MockViewHistoryModel = jest.fn().mockImplementation((data) => ({
      ...data,
      save: jest.fn().mockResolvedValue(true)
    }));

    // Add methods to the constructor function
    const mockViewHistoryModel = Object.assign(MockViewHistoryModel, {
      findOne: jest.fn(),
      aggregate: jest.fn(),
      updateOne: jest.fn(),
      create: jest.fn()
    }) as any;

    const mockMasterPropertiesModel = {
      exists: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ViewHistoryService,
        {
          provide: getModelToken(SystemUserViewHistoryEntity.name),
          useValue: mockViewHistoryModel
        },
        {
          provide: getModelToken(MasterPropertiesEntity.name),
          useValue: mockMasterPropertiesModel
        }
      ]
    }).compile();

    service = module.get<ViewHistoryService>(ViewHistoryService);
    viewHistoryModel = module.get(
      getModelToken(SystemUserViewHistoryEntity.name)
    );
    masterPropertiesModel = module.get(
      getModelToken(MasterPropertiesEntity.name)
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('recordView', () => {
    it('should create new view history record', async () => {
      const userId = TEST_USER_ID;
      const propertyId = new Types.ObjectId().toString();
      const newViewHistory = {
        ...mockViewHistory,
        save: jest.fn().mockResolvedValue(true)
      };

      masterPropertiesModel.exists.mockReturnValue({
        exec: jest.fn().mockResolvedValue(true)
      });
      viewHistoryModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null)
      });
      (viewHistoryModel as any).mockImplementation(() => newViewHistory);

      const result = await service.recordView(userId, propertyId);

      expect(result.statusCode).toBe(201);
      expect(result.data.recorded).toBe(true);
      expect(newViewHistory.save).toHaveBeenCalled();
    });

    it('should update existing view history timestamp', async () => {
      const userId = TEST_USER_ID;
      const propertyId = new Types.ObjectId().toString();
      const existingViewHistory = {
        ...mockViewHistory,
        isVoid: false,
        save: jest.fn().mockResolvedValue(true)
      };

      masterPropertiesModel.exists.mockReturnValue({
        exec: jest.fn().mockResolvedValue(true)
      });
      viewHistoryModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(existingViewHistory)
      });

      const result = await service.recordView(userId, propertyId);

      expect(result.statusCode).toBe(200);
      expect(result.data.recorded).toBe(true);
      expect(existingViewHistory.save).toHaveBeenCalled();
    });

    it('should restore voided view history', async () => {
      const userId = TEST_USER_ID;
      const propertyId = new Types.ObjectId().toString();
      const voidedViewHistory = {
        ...mockViewHistory,
        isVoid: true,
        save: jest.fn().mockResolvedValue(true)
      };

      masterPropertiesModel.exists.mockReturnValue({
        exec: jest.fn().mockResolvedValue(true)
      });
      viewHistoryModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(voidedViewHistory)
      });

      const result = await service.recordView(userId, propertyId);

      expect(result.statusCode).toBe(200);
      expect(result.data.recorded).toBe(true);
      expect(voidedViewHistory.isVoid).toBe(false);
      expect(voidedViewHistory.save).toHaveBeenCalled();
    });

    it('should return 400 for invalid property id', async () => {
      const result = await service.recordView(TEST_USER_ID, 'invalid-id');

      expect(result.statusCode).toBe(400);
      expect(result.error).toBe('Invalid property id');
    });

    it('should return 404 when property does not exist', async () => {
      const userId = TEST_USER_ID;
      const propertyId = new Types.ObjectId().toString();

      masterPropertiesModel.exists.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null)
      });

      const result = await service.recordView(userId, propertyId);

      expect(result.statusCode).toBe(404);
      expect(result.error).toBe('Property not found');
    });
  });

  describe('getUserViewHistory', () => {
    it('should return user view history', async () => {
      const userId = TEST_USER_ID;
      const mockResult = [
        {
          ...mockProperty,
          _id: mockProperty._id.toString(),
          viewHistoryId: mockViewHistory._id.toString()
        }
      ];

      viewHistoryModel.aggregate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockResult)
      });

      const result = await service.getUserViewHistory(userId);

      expect(result.statusCode).toBe(200);
      expect(result.data).toHaveLength(1);
    });

    it('should return empty array when no view history', async () => {
      const userId = TEST_USER_ID;

      viewHistoryModel.aggregate.mockReturnValue({
        exec: jest.fn().mockResolvedValue([])
      });

      const result = await service.getUserViewHistory(userId);

      expect(result.statusCode).toBe(200);
      expect(result.data).toHaveLength(0);
    });
  });

  describe('removeViewProperty', () => {
    it('should remove view property successfully', async () => {
      const userId = TEST_USER_ID;
      const viewHistoryId = new Types.ObjectId().toString();

      viewHistoryModel.updateOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ modifiedCount: 1 })
      });

      const result = await service.removeViewProperty(userId, viewHistoryId);

      expect(result.statusCode).toBe(200);
      expect(result.data.removed).toBe(true);
    });

    it('should return 404 when view history not found', async () => {
      const userId = TEST_USER_ID;
      const viewHistoryId = new Types.ObjectId().toString();

      viewHistoryModel.updateOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ modifiedCount: 0 })
      });

      const result = await service.removeViewProperty(userId, viewHistoryId);

      expect(result.statusCode).toBe(404);
      expect(result.data.removed).toBe(false);
    });
  });
});
