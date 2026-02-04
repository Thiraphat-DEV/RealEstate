import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { ServiceResponse, ResponseHelper } from 'src/common';
import { MongoLookupHelper } from 'src/common/helper/mongo-lookup-helper';
import { GetPropertyDTO, GetPropertiesFilterDTO } from '../dto';
import {
  MasterPropertiesEntity,
  MasterPropertiesDocument
} from 'src/modules/schema/master/ms_properties.entity';
import {
  PropertyReviewEntity,
  PropertyReviewDocument
} from 'src/modules/schema/systems/property-review.entity';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(MasterPropertiesEntity.name)
    private readonly masterPropertiesModel: Model<MasterPropertiesDocument>,
    @InjectModel(PropertyReviewEntity.name)
    private readonly ssPropertyReviewModel: Model<PropertyReviewDocument>
  ) {}

  async getAllProperties(
    query?: GetPropertiesFilterDTO
  ): Promise<ServiceResponse<MasterPropertiesDocument[]>> {
    try {
      const page =
        query?.page && Number(query.page) > 0 ? Number(query.page) : 1;
      const pageLimit =
        query?.pageLimit && Number(query.pageLimit) > 0
          ? Number(query.pageLimit)
          : 20;
      const skipPage = (page - 1) * pageLimit;

      const filter = {
        ...(query?.address &&
          query.address !== '' && {
            address: new Types.ObjectId(query.address)
          }),
        ...(query?.propertyType &&
          query.propertyType !== '' && {
            propertyType: new Types.ObjectId(query.propertyType)
          }),
        ...(query?.priceMin && { price: { $gte: query.priceMin } }),
        ...(query?.priceMax && { price: { $lte: query.priceMax } }),
        ...(query?.bedrooms && { bedrooms: { $gte: query.bedrooms } }),
        ...(query?.bathrooms && { bathrooms: { $gte: query.bathrooms } }),
        ...(query?.areaMin && { area: { $gte: query.areaMin } }),
        ...(query?.areaMax && { area: { $lte: query.areaMax } })
      };

      const ratingArr = query?.rating != null
        ? (Array.isArray(query.rating) ? query.rating : [query.rating])
        : [];
      if (ratingArr.length > 0) {
        const pipelinePropertiesByRating: PipelineStage[] = [
          {
            $match: {
              rating: { $in: ratingArr },
              status: 'active'
            }
          },
          {
            $sort: { rating: 1 }
          },
          {
            $group: {
              _id: '$propertyId',
              ratings: { $push: '$rating' },
              count: { $sum: 1 }
            }
          },
          {
            $project: {
              _id: 1,
              medianRating: {
                $cond: {
                  if: { $eq: ['$count', 0] },
                  then: 0,
                  else: {
                    $cond: {
                      if: { $eq: [{ $mod: ['$count', 2] }, 0] }, // Even number of ratings
                      then: {
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

        const propertiesByRating = (
          await this.ssPropertyReviewModel
            .aggregate(pipelinePropertiesByRating)
            .exec()
        )?.map((e) => e?._id);
        filter['_id'] = { $in: propertiesByRating };
      }

      const basePipeline: PipelineStage[] = [
        {
          $match: Object.keys(filter).length > 0 ? filter : {}
        },
        {
          $lookup: MongoLookupHelper.getMasterLookupStage(
            'ms_properties_type',
            'propertyType'
          )
        },
        {
          $unwind: '$propertyType'
        },
        {
          $lookup: MongoLookupHelper.getMasterLookupStage(
            'ms_properties_status',
            'status'
          )
        },
        {
          $unwind: '$status'
        },
        {
          $lookup: {
            from: 'ms_address',
            localField: 'address',
            foreignField: '_id',
            as: 'address',
            pipeline: [
              {
                $match: {
                  ...(query?.location &&
                    query.location !== '' && {
                      city: new Types.ObjectId(query.location)
                    })
                }
              },
              {
                $lookup: {
                  from: 'ms_city',
                  localField: 'city',
                  foreignField: '_id',
                  as: 'city'
                }
              },
              {
                $unwind: '$city'
              }
            ]
          }
        },
        {
          $unwind: '$address'
        },
        ...(query?.search && query.search !== ''
          ? [
              {
                $match: {
                  $or: [
                    { title: { $regex: query.search, $options: 'i' } },
                    {
                      'propertyType.name': {
                        $regex: query.search,
                        $options: 'i'
                      }
                    },
                    {
                      'address.city.name': {
                        $regex: query.search,
                        $options: 'i'
                      }
                    },
                    {
                      'address.city.province': {
                        $regex: query.search,
                        $options: 'i'
                      }
                    }
                  ]
                }
              }
            ]
          : [])
      ];

      const countPipeline: PipelineStage[] = [
        ...basePipeline,
        {
          $count: 'total'
        }
      ];

      const countResult = await this.masterPropertiesModel
        .aggregate(countPipeline)
        .exec();
      const total = countResult.length > 0 ? countResult[0].total : 0;
      const dataPipeline: PipelineStage[] = [
        ...basePipeline,
        {
          $skip: skipPage
        },
        {
          $limit: pageLimit
        },
        {
          $project: {
            _id: { $toString: '$_id' },
            title: 1,
            price: 1,
            location: 1,
            bedrooms: 1,
            bathrooms: 1,
            area: 1,
            images: 1,
            createdAt: 1,
            updatedAt: 1,
            propertyType: {
              $cond: {
                if: { $ne: ['$propertyType._id', null] },
                then: { $toString: '$propertyType._id' },
                else: null
              }
            },
            propertyTypeName: '$propertyType.name',
            status: {
              $cond: {
                if: { $ne: ['$status._id', null] },
                then: { $toString: '$status._id' },
                else: null
              }
            },
            statusName: '$status.name',
            address: {
              $cond: {
                if: { $ne: ['$address', null] },
                then: {
                  _id: { $toString: '$address._id' },
                  name: '$address.name',
                  district: '$address.district',
                  subDistrict: '$address.subDistrict',
                  city: {
                    $cond: {
                      if: { $ne: ['$address.city', null] },
                      then: {
                        _id: { $toString: '$address.city._id' },
                        name: '$address.city.name',
                        province: '$address.city.province',
                        country: '$address.city.country'
                      },
                      else: null
                    }
                  }
                },
                else: null
              }
            }
          }
        }
      ];

      const result = await this.masterPropertiesModel
        .aggregate(dataPipeline)
        .exec();

      return ResponseHelper<MasterPropertiesDocument[]>(result, 200, null, {
        total,
        page,
        pageLimit,
        totalPages: Math.ceil(total / pageLimit)
      });
    } catch (error) {
      console.error('Service - Error fetching properties:', error);
      return ResponseHelper<MasterPropertiesDocument[] | null>(
        null,
        500,
        error
      );
    }
  }

  async getPropertyById(
    id: string
  ): Promise<ServiceResponse<MasterPropertiesDocument | null>> {
    try {
      if (!id) {
        return ResponseHelper<MasterPropertiesDocument | null>(
          null,
          400,
          'Property id is required'
        );
      }

      const objectId = new Types.ObjectId(id);

      const pipeline: PipelineStage[] = [
        {
          $match: { _id: objectId }
        },
        {
          $lookup: MongoLookupHelper.getMasterLookupStage(
            'ms_properties_type',
            'propertyType'
          )
        },
        {
          $unwind: '$propertyType'
        },
        {
          $lookup: MongoLookupHelper.getMasterLookupStage(
            'ms_properties_status',
            'status'
          )
        },
        {
          $unwind: '$status'
        },
        {
          $lookup: {
            from: 'ms_address',
            localField: 'address',
            foreignField: '_id',
            as: 'address',
            pipeline: [
              {
                $lookup: {
                  from: 'ms_city',
                  localField: 'city',
                  foreignField: '_id',
                  as: 'city'
                }
              },
              {
                $unwind: '$city'
              }
            ]
          }
        },
        {
          $unwind: '$address'
        },
        {
          $lookup: {
            from: 'ms_properties',
            let: { currentId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $gt: ['$_id', '$$currentId'] }
                }
              },
              {
                $sort: { _id: 1 }
              },
              {
                $limit: 1
              },
              {
                $project: {
                  _id: 1
                }
              }
            ],
            as: 'nextProperty'
          }
        },
        {
          $project: {
            _id: { $toString: '$_id' },
            title: 1,
            price: 1,
            location: 1,
            bedrooms: 1,
            bathrooms: 1,
            area: 1,
            images: 1,
            createdAt: 1,
            updatedAt: 1,
            propertyType: {
              $cond: {
                if: { $ne: ['$propertyType._id', null] },
                then: { $toString: '$propertyType._id' },
                else: null
              }
            },
            propertyTypeName: '$propertyType.name',
            status: {
              $cond: {
                if: { $ne: ['$status._id', null] },
                then: { $toString: '$status._id' },
                else: null
              }
            },
            statusName: '$status.name',
            address: {
              $cond: {
                if: { $ne: ['$address', null] },
                then: {
                  $cond: {
                    if: { $ne: ['$address._id', null] },
                    then: { $toString: '$address._id' },
                    else: '$address'
                  }
                },
                else: null
              }
            },
            nextPropertyID: {
              $cond: {
                if: { $gt: [{ $size: '$nextProperty' }, 0] },
                then: { $toString: { $arrayElemAt: ['$nextProperty._id', 0] } },
                else: null
              }
            },
            description: {
              $concat: [
                {
                  $cond: {
                    if: { $ne: ['$area', null] },
                    then: {
                      $concat: [
                        ' เป็นพื้นที่กว้าง ',
                        { $toString: '$area' },
                        ' ตารางเมตร'
                      ]
                    },
                    else: ''
                  }
                },
                {
                  $cond: {
                    if: { $ne: ['$bedrooms', null] },
                    then: {
                      $concat: [' ', { $toString: '$bedrooms' }, ' ห้องนอน']
                    },
                    else: ''
                  }
                },
                {
                  $cond: {
                    if: { $ne: ['$bathrooms', null] },
                    then: {
                      $concat: [' ', { $toString: '$bathrooms' }, ' ห้องน้ำ']
                    },
                    else: ''
                  }
                },
                {
                  $cond: {
                    if: { $ne: ['$address', null] },
                    then: {
                      $concat: [
                        ' อยู่ที่',
                        {
                          $cond: {
                            if: {
                              $ne: [
                                { $ifNull: ['$address.subDistrict', null] },
                                null
                              ]
                            },
                            then: {
                              $concat: [
                                ' ตำบล',
                                { $ifNull: ['$address.subDistrict', ''] }
                              ]
                            },
                            else: ''
                          }
                        },
                        {
                          $cond: {
                            if: {
                              $ne: [
                                { $ifNull: ['$address.district', null] },
                                null
                              ]
                            },
                            then: {
                              $concat: [
                                ' อำเภอ',
                                { $ifNull: ['$address.district', ''] }
                              ]
                            },
                            else: ''
                          }
                        },
                        {
                          $cond: {
                            if: {
                              $ne: [
                                { $ifNull: ['$address.city.name', null] },
                                null
                              ]
                            },
                            then: {
                              $concat: [
                                ' ',
                                { $ifNull: ['$address.city.name', ''] }
                              ]
                            },
                            else: ''
                          }
                        }
                      ]
                    },
                    else: ''
                  }
                }
              ]
            }
          }
        }
      ];

      const result = await this.masterPropertiesModel
        .aggregate(pipeline)
        .exec();

      if (!result || result.length === 0) {
        return ResponseHelper<MasterPropertiesDocument | null>(
          null,
          404,
          'Property not found'
        );
      }

      return ResponseHelper<MasterPropertiesDocument | null>(
        result[0] as MasterPropertiesDocument,
        200,
        null
      );
    } catch (error) {
      return ResponseHelper<MasterPropertiesDocument | null>(null, 500, error);
    }
  }
}
