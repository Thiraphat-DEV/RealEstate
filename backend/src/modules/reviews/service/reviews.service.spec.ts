import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ReviewsService } from './reviews.service';
import { PropertyReviewEntity } from 'src/modules/schema/systems/property-review.entity';
import { CreateReviewDTO } from '../dto';
import { Types } from 'mongoose';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let reviewModel: any;

  const mockReview = {
    _id: new Types.ObjectId(),
    propertyId: new Types.ObjectId(),
    rating: 5,
    comment: 'Great property',
    status: 'active',
    toObject: jest.fn()
  };

  beforeEach(async () => {
    const MockReviewModel = jest.fn().mockImplementation((data) => ({
      ...data,
      save: jest.fn().mockResolvedValue(true),
      toObject: jest.fn().mockReturnValue({
        _id: new Types.ObjectId(),
        ...data
      })
    }));

    // Add methods to the constructor function
    const mockReviewModel = Object.assign(MockReviewModel, {
      aggregate: jest.fn()
    }) as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: getModelToken(PropertyReviewEntity.name),
          useValue: mockReviewModel
        }
      ]
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    reviewModel = module.get(getModelToken(PropertyReviewEntity.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createReview', () => {
    it('should create review successfully', async () => {
      const createReviewDto: CreateReviewDTO = {
        propertyId: new Types.ObjectId().toString(),
        rating: 5,
        comment: 'Great property'
      };

      const newReview = {
        ...mockReview,
        save: jest.fn().mockResolvedValue(true),
        toObject: jest.fn().mockReturnValue({
          ...mockReview,
          _id: mockReview._id.toString(),
          propertyId: mockReview.propertyId.toString()
        })
      };

      // Mock constructor is already set in beforeEach
      (reviewModel as any).mockImplementation(() => newReview);

      const result = await service.createReview(createReviewDto);

      expect(result.statusCode).toBe(201);
      expect(result.data).toBeDefined();
      expect(newReview.save).toHaveBeenCalled();
    });

    it('should create review without comment', async () => {
      const createReviewDto: CreateReviewDTO = {
        propertyId: new Types.ObjectId().toString(),
        rating: 4
      };

      const newReview = {
        ...mockReview,
        comment: undefined,
        save: jest.fn().mockResolvedValue(true),
        toObject: jest.fn().mockReturnValue({
          ...mockReview,
          comment: undefined
        })
      };

      (reviewModel as any).mockImplementation(() => newReview);

      const result = await service.createReview(createReviewDto);

      expect(result.statusCode).toBe(201);
      expect(result.data).toBeDefined();
    });

    it('should handle errors', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const createReviewDto: CreateReviewDTO = {
        propertyId: new Types.ObjectId().toString(),
        rating: 5
      };

      const newReview = {
        save: jest.fn().mockRejectedValue(new Error('Database error'))
      };

      (reviewModel as any).mockImplementation(() => newReview);

      const result = await service.createReview(createReviewDto);

      expect(result.statusCode).toBe(500);
      expect(result.error).toBeDefined();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('getReviewsByPropertyId', () => {
    it('should return reviews for property', async () => {
      const propertyId = new Types.ObjectId().toString();
      const mockReviews = [
        {
          ...mockReview,
          _id: mockReview._id.toString(),
          propertyId: propertyId
        }
      ];

      reviewModel.aggregate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockReviews)
      });

      const result = await service.getReviewsByPropertyId(propertyId);

      expect(result.statusCode).toBe(200);
      expect(result.data).toHaveLength(1);
    });

    it('should return empty array when no reviews', async () => {
      const propertyId = new Types.ObjectId().toString();

      reviewModel.aggregate.mockReturnValue({
        exec: jest.fn().mockResolvedValue([])
      });

      const result = await service.getReviewsByPropertyId(propertyId);

      expect(result.statusCode).toBe(200);
      expect(result.data).toHaveLength(0);
    });

    it('should handle errors', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const propertyId = new Types.ObjectId().toString();

      reviewModel.aggregate.mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      const result = await service.getReviewsByPropertyId(propertyId);

      expect(result.statusCode).toBe(500);
      expect(result.error).toBeDefined();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('getRatingDataByPropertyId', () => {
    it('should return rating data with statistics', async () => {
      const propertyId = new Types.ObjectId().toString();
      const mockRatingData = [
        {
          averageRating: 4.5,
          medianRating: 4.5,
          totalReviews: 10,
          ratingDistribution: { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4 }
        }
      ];

      reviewModel.aggregate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockRatingData)
      });

      const result = await service.getRatingDataByPropertyId(propertyId);

      expect(result.statusCode).toBe(200);
      expect(result.data.averageRating).toBe(4.5);
      expect(result.data.totalReviews).toBe(10);
    });

    it('should return default values when no reviews', async () => {
      const propertyId = new Types.ObjectId().toString();

      reviewModel.aggregate.mockReturnValue({
        exec: jest.fn().mockResolvedValue([])
      });

      const result = await service.getRatingDataByPropertyId(propertyId);

      expect(result.statusCode).toBe(200);
      expect(result.data.averageRating).toBe(0);
      expect(result.data.totalReviews).toBe(0);
      expect(result.data.ratingDistribution).toEqual({
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
      });
    });

    it('should handle errors', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const propertyId = new Types.ObjectId().toString();

      reviewModel.aggregate.mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      const result = await service.getRatingDataByPropertyId(propertyId);

      expect(result.statusCode).toBe(500);
      expect(result.error).toBeDefined();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('getMedianRatingByPropertyId', () => {
    it('should return median rating', async () => {
      const propertyId = new Types.ObjectId().toString();
      const mockResult = [{ medianRating: 4.5 }];

      reviewModel.aggregate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockResult)
      });

      const result = await service.getMedianRatingByPropertyId(propertyId);

      expect(result.statusCode).toBe(200);
      expect(result.data).toBe(4.5);
    });

    it('should return 0 when no reviews', async () => {
      const propertyId = new Types.ObjectId().toString();

      reviewModel.aggregate.mockReturnValue({
        exec: jest.fn().mockResolvedValue([])
      });

      const result = await service.getMedianRatingByPropertyId(propertyId);

      expect(result.statusCode).toBe(200);
      expect(result.data).toBe(0);
    });

    it('should handle errors', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const propertyId = new Types.ObjectId().toString();

      reviewModel.aggregate.mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      const result = await service.getMedianRatingByPropertyId(propertyId);

      expect(result.statusCode).toBe(500);
      expect(result.data).toBe(0);

      consoleErrorSpy.mockRestore();
    });
  });




});
