import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, PipelineStage } from 'mongoose';
import { ResponseHelper, ServiceResponse } from '../../../common';
import {
  SystemUserViewHistoryDocument,
  SystemUserViewHistoryEntity
} from '../../schema/systems/user-view-history.entity';
import {
  MasterPropertiesDocument,
  MasterPropertiesEntity
} from '../../schema/master/ms_properties.entity';
import { MongoLookupHelper } from '../../../common/helper/mongo-lookup-helper';

@Injectable()
export class ViewHistoryService {
  constructor(
    @InjectModel(SystemUserViewHistoryEntity.name)
    private readonly viewHistoryModel: Model<SystemUserViewHistoryDocument>,
    @InjectModel(MasterPropertiesEntity.name)
    private readonly masterPropertiesModel: Model<MasterPropertiesDocument>
  ) {}
  async recordView(
    userId: string,
    propertyId: string
  ): Promise<ServiceResponse<{ recorded: boolean }>> {
    if (!Types.ObjectId.isValid(propertyId)) {
      return ResponseHelper<{ recorded: boolean }>(
        null,
        400,
        'Invalid property id'
      );
    }

    const userObjectId = new Types.ObjectId(userId);
    const propertyObjectId = new Types.ObjectId(propertyId);

    // Check if property exists
    const propertyExists = await this.masterPropertiesModel
      .exists({ _id: propertyObjectId })
      .exec();

    if (!propertyExists) {
      return ResponseHelper<{ recorded: boolean }>(
        null,
        404,
        'Property not found'
      );
    }

    // Check if view history already exists for this user and property
    const existing = await this.viewHistoryModel
      .findOne({ userId: userObjectId, propertyId: propertyObjectId })
      .exec();

    if (existing) {
      // If record exists but is voided, restore it
      if (existing.isVoid) {
        existing.isVoid = false;
        existing.updatedAt = new Date();
        existing.updateBy = userId;
        await existing.save();
        return ResponseHelper<{ recorded: boolean }>(
          { recorded: true },
          200,
          null
        );
      }
      // If record exists and is not voided, just update timestamp
      existing.updatedAt = new Date();
      existing.updateBy = userId;
      await existing.save();
      return ResponseHelper<{ recorded: boolean }>(
        { recorded: true },
        200,
        null
      );
    }

    // Create new view history record
    const viewHistory = new this.viewHistoryModel({
      userId: userObjectId,
      propertyId: propertyObjectId,
      createBy: userId,
      updateBy: userId,
      isVoid: false
    });

    await viewHistory.save();

    return ResponseHelper<{ recorded: boolean }>({ recorded: true }, 201, null);
  }

  async getUserViewHistory(
    userId: string
  ): Promise<ServiceResponse<MasterPropertiesDocument[]>> {
    const userObjectId = new Types.ObjectId(userId);

    const pipeline: PipelineStage[] = [
      {
        $match: { userId: userObjectId, isVoid: false }
      },
      {
        $sort: { updatedAt: -1 }
      },
      {
        $lookup: {
          from: 'ms_properties',
          localField: 'propertyId',
          foreignField: '_id',
          as: 'property'
        }
      },
      {
        $unwind: {
          path: '$property',
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $addFields: {
          'property.viewHistoryId': { $toString: '$_id' }
        }
      },
      {
        $replaceRoot: {
          newRoot: '$property'
        }
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
        $unwind: {
          path: '$address',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: { $toString: '$_id' },
          title: 1,
          location: 1,
          description: 1,
          price: 1,
          bedrooms: 1,
          bathrooms: 1,
          area: 1,
          images: 1,
          createdAt: 1,
          updatedAt: 1,
          propertyType: { $toString: '$propertyType._id' },
          propertyTypeName: '$propertyType.name',
          status: { $toString: '$status._id' },
          statusName: '$status.name',
          address: {
            $cond: {
              if: { $ne: ['$address', null] },
              then: { $toString: '$address._id' },
              else: null
            }
          },
          viewHistoryId: 1
        }
      }
    ];

    const result = await this.viewHistoryModel.aggregate(pipeline).exec();

    return ResponseHelper<MasterPropertiesDocument[]>(
      result as MasterPropertiesDocument[],
      200,
      null
    );
  }

  async removeViewProperty(
    userId: string,
    viewHistoryId: string
  ): Promise<ServiceResponse<{ removed: boolean }>> {
    const userObjectId = new Types.ObjectId(userId);
    const viewHistoryObjectId = new Types.ObjectId(viewHistoryId);
    const result = await this.viewHistoryModel
      .updateOne(
        {
          _id: viewHistoryObjectId,
          userId: userObjectId
        },
        {
          isVoid: true
        }
      )
      .exec();

    return ResponseHelper<{ removed: boolean }>(
      { removed: result.modifiedCount > 0 ? true : false },
      result.modifiedCount > 0 ? 200 : 404,
      null
    );
  }
}
