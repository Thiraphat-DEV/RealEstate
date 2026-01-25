import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, PipelineStage } from 'mongoose';
import { ServiceResponse, ResponseHelper } from 'src/common';
import {
  PropertyReviewEntity,
  PropertyReviewDocument
} from 'src/modules/schema/systems/property-review.entity';
import { CreateReviewDTO } from '../dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(PropertyReviewEntity.name)
    private readonly reviewModel: Model<PropertyReviewDocument>
  ) {}

  async createReview(
    body: CreateReviewDTO
  ): Promise<ServiceResponse<PropertyReviewDocument | null>> {
    try {
      const newReview = new this.reviewModel({
        propertyId: new Types.ObjectId(body.propertyId),
        rating: body.rating,
        comment: body.comment || undefined,
        status: 'active'
      });

      await newReview.save();
      const plain = newReview.toObject();

      const formatted = {
        ...plain,
        _id: plain._id?.toString?.() || plain._id,
        propertyId: plain.propertyId?.toString?.() || plain.propertyId
      } as unknown as PropertyReviewDocument;

      return ResponseHelper<PropertyReviewDocument | null>(
        formatted,
        201,
        null
      );
    } catch (error) {
      console.error('ReviewsService - Error creating review:', error);
      return ResponseHelper<PropertyReviewDocument | null>(null, 500, error);
    }
  }

  async getReviewsByPropertyId(
    propertyId: string
  ): Promise<ServiceResponse<PropertyReviewDocument[]>> {
    try {
      const objectId = new Types.ObjectId(propertyId);

      const pipeline: PipelineStage[] = [
        {
          $match: {
            propertyId: objectId,
            status: 'active'
          }
        },
        {
          $sort: { createdAt: -1 }
        }
      ];

      const reviews = await this.reviewModel.aggregate(pipeline).exec();

      return ResponseHelper<PropertyReviewDocument[]>(reviews, 200, null);
    } catch (error) {
      console.error('ReviewsService - Error fetching reviews:', error);
      return ResponseHelper<PropertyReviewDocument[] | null>(null, 500, error);
    }
  }

  async getRatingDataByPropertyId(
    propertyId: string
  ): Promise<ServiceResponse<any>> {
    try {
      const objectId = new Types.ObjectId(propertyId);

      const pipeline: PipelineStage[] = [
        {
          $match: {
            propertyId: objectId,
            status: 'active'
          }
        },
        {
          $sort: { rating: 1 }
        },
        {
          $facet: {
            stats: [
              {
                $group: {
                  _id: null,
                  averageRating: { $avg: '$rating' },
                  totalReviews: { $sum: 1 },
                  ratings: { $push: '$rating' }
                }
              }
            ],
            distribution: [
              {
                $group: {
                  _id: '$rating',
                  count: { $sum: 1 }
                }
              }
            ]
          }
        },
        {
          $project: {
            _id: 0,
            stats: { $arrayElemAt: ['$stats', 0] },
            distribution: 1
          }
        },
        {
          $project: {
            _id: 0,
            averageRating: '$stats.averageRating',
            totalReviews: '$stats.totalReviews',
            ratings: '$stats.ratings',
            ratingDistribution: {
              $arrayToObject: {
                $map: {
                  input: [1, 2, 3, 4, 5],
                  as: 'rating',
                  in: {
                    k: { $toString: '$$rating' },
                    v: {
                      $ifNull: [
                        {
                          $let: {
                            vars: {
                              found: {
                                $arrayElemAt: [
                                  {
                                    $filter: {
                                      input: '$distribution',
                                      as: 'dist',
                                      cond: { $eq: ['$$dist._id', '$$rating'] }
                                    }
                                  },
                                  0
                                ]
                              }
                            },
                            in: '$$found.count'
                          }
                        },
                        0
                      ]
                    }
                  }
                }
              }
            },
            medianRating: {
              $cond: {
                if: { $eq: ['$stats.totalReviews', 0] },
                then: 0,
                else: {
                  $cond: {
                    if: { $eq: [{ $mod: ['$stats.totalReviews', 2] }, 0] },
                    then: {
                      $divide: [
                        {
                          $add: [
                            {
                              $arrayElemAt: [
                                '$stats.ratings',
                                {
                                  $subtract: [
                                    { $divide: ['$stats.totalReviews', 2] },
                                    1
                                  ]
                                }
                              ]
                            },
                            {
                              $arrayElemAt: [
                                '$stats.ratings',
                                { $divide: ['$stats.totalReviews', 2] }
                              ]
                            }
                          ]
                        },
                        2
                      ]
                    },
                    else: {
                      $arrayElemAt: [
                        '$stats.ratings',
                        { $floor: { $divide: ['$stats.totalReviews', 2] } }
                      ]
                    }
                  }
                }
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            averageRating: {
              $divide: [{ $round: { $multiply: ['$averageRating', 10] } }, 10]
            },
            medianRating: {
              $divide: [{ $round: { $multiply: ['$medianRating', 10] } }, 10]
            },
            totalReviews: 1,
            ratingDistribution: 1
          }
        }
      ];

      const result = await this.reviewModel.aggregate(pipeline).exec();

      if (!result || result.length === 0) {
        return ResponseHelper<any>(
          {
            averageRating: 0,
            medianRating: 0,
            totalReviews: 0,
            ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
          },
          200,
          null
        );
      }

      const data = result[0];

      return ResponseHelper<any>(data, 200, null);
    } catch (error) {
      console.error('ReviewsService - Error fetching rating data:', error);
      return ResponseHelper<any>(null, 500, error);
    }
  }

  async getMedianRatingByPropertyId(
    propertyId: string
  ): Promise<ServiceResponse<number>> {
    try {
      const objectId = new Types.ObjectId(propertyId);

      const pipeline: PipelineStage[] = [
        {
          $match: {
            propertyId: objectId,
            status: 'active'
          }
        },
        {
          $sort: { rating: 1 }
        },
        {
          $group: {
            _id: null,
            ratings: { $push: '$rating' },
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            medianRating: {
              $cond: {
                if: { $eq: ['$count', 0] },
                then: 0,
                else: {
                  $cond: {
                    if: { $eq: [{ $mod: ['$count', 2] }, 0] }, // Even number of ratings
                    then: {
                      // For even: average of two middle values
                      $divide: [
                        {
                          $add: [
                            {
                              $arrayElemAt: [
                                '$ratings',
                                { $subtract: [{ $divide: ['$count', 2] }, 1] }
                              ]
                            },
                            {
                              $arrayElemAt: [
                                '$ratings',
                                { $divide: ['$count', 2] }
                              ]
                            }
                          ]
                        },
                        2
                      ]
                    },
                    else: {
                      // For odd: middle value
                      $arrayElemAt: [
                        '$ratings',
                        { $floor: { $divide: ['$count', 2] } }
                      ]
                    }
                  }
                }
              }
            }
          }
        }
      ];

      const result = await this.reviewModel.aggregate(pipeline).exec();

      if (!result || result.length === 0 || !result[0].medianRating) {
        return ResponseHelper<number>(0, 200, null);
      }

      const medianRating = result[0].medianRating;

      return ResponseHelper<number>(
        Math.round(medianRating * 10) / 10,
        200,
        null
      );
    } catch (error) {
      console.error('ReviewsService - Error fetching median rating:', error);
      return ResponseHelper<number>(0, 500, error);
    }
  }
}
