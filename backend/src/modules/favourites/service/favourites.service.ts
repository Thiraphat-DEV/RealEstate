import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ResponseHelper, ServiceResponse } from '../../../common';
import {
  FavouritesPropertyDocument,
  FavouritesPropertyEntity
} from '../../schema/systems/favourite-property.entity';
import {
  MasterPropertiesDocument,
  MasterPropertiesEntity
} from '../../schema/master/ms_properties.entity';

@Injectable()
export class FavouritesService {
  constructor(
    @InjectModel(FavouritesPropertyEntity.name)
    private readonly favouritesModel: Model<FavouritesPropertyDocument>,
    @InjectModel(MasterPropertiesEntity.name)
    private readonly masterPropertiesModel: Model<MasterPropertiesDocument>
  ) {}

  async toggleFavourite(
    userId: string,
    propertyId: string
  ): Promise<ServiceResponse<{ isFavourite: boolean }>> {
    if (!Types.ObjectId.isValid(propertyId)) {
      return ResponseHelper<{ isFavourite: boolean }>(
        null,
        400,
        'Invalid property id'
      );
    }

    const userObjectId = new Types.ObjectId(userId);
    const propertyObjectId = new Types.ObjectId(propertyId);

    const existing = await this.favouritesModel
      .findOne({ userId: userObjectId, propertyId: propertyObjectId })
      .exec();

    if (existing) {
      await this.favouritesModel.deleteOne({ _id: existing._id }).exec();
      return ResponseHelper<{ isFavourite: boolean }>(
        { isFavourite: false },
        200,
        null
      );
    }

    const propertyExists = await this.masterPropertiesModel
      .exists({ _id: propertyObjectId })
      .exec();

    if (!propertyExists) {
      return ResponseHelper<{ isFavourite: boolean }>(
        null,
        404,
        'Property not found'
      );
    }

    const favourite = new this.favouritesModel({
      userId: userObjectId,
      propertyId: propertyObjectId,
      createBy: userId,
      updateBy: userId
    });

    await favourite.save();

    return ResponseHelper<{ isFavourite: boolean }>(
      { isFavourite: true },
      201,
      null
    );
  }

  async getUserFavourites(
    userId: string
  ): Promise<ServiceResponse<MasterPropertiesDocument[]>> {
    const userObjectId = new Types.ObjectId(userId);

    const favourites = await this.favouritesModel
      .find({ userId: userObjectId })
      .lean()
      .exec();

    const propertyIds = favourites
      .map((fav) => fav.propertyId)
      .filter((id) => !!id);

    if (!propertyIds.length) {
      return ResponseHelper<MasterPropertiesDocument[]>([], 200, null);
    }

    const result = await this.masterPropertiesModel
      .find({ _id: { $in: propertyIds } })
      .lean()
      .exec();

    const formatted = (result || []).map((prop: any) => ({
      ...prop,
      _id: prop._id?.toString() || prop._id,
      propertyType: prop.propertyType?.toString?.()
        ? prop.propertyType.toString()
        : prop.propertyType,
      status: prop.status?.toString?.() ? prop.status.toString() : prop.status,
      address: prop.address?.toString?.()
        ? prop.address.toString()
        : prop.address
    })) as MasterPropertiesDocument[];

    return ResponseHelper<MasterPropertiesDocument[]>(formatted, 200, null);
  }

  async isFavourite(
    userId: string,
    propertyId: string
  ): Promise<ServiceResponse<{ isFavourite: boolean }>> {
    if (!Types.ObjectId.isValid(propertyId)) {
      return ResponseHelper<{ isFavourite: boolean }>(
        null,
        400,
        'Invalid property id'
      );
    }

    const userObjectId = new Types.ObjectId(userId);
    const propertyObjectId = new Types.ObjectId(propertyId);

    const existing = await this.favouritesModel
      .exists({ userId: userObjectId, propertyId: propertyObjectId })
      .exec();

    return ResponseHelper<{ isFavourite: boolean }>(
      { isFavourite: !!existing },
      200,
      null
    );
  }
}
