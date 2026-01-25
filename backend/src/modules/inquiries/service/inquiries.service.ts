import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceResponse, ResponseHelper } from 'src/common';
import {
  SystemInquiryEntity,
  SystemInquiryDocument
} from 'src/modules/schema/systems/inquiry.entity';
import { CreateInquiryDTO } from '../dto';

@Injectable()
export class InquiriesService {
  constructor(
    @InjectModel(SystemInquiryEntity.name)
    private readonly inquiryModel: Model<SystemInquiryDocument>
  ) {}

  async createInquiry(
    body: CreateInquiryDTO
  ): Promise<ServiceResponse<SystemInquiryDocument | null>> {
    try {
      const newInquiry = new this.inquiryModel({
        name: body.name,
        email: body.email,
        phone: body.phone || undefined,
        question: body.question,
        status: 'pending'
      });

      await newInquiry.save();
      const plain = newInquiry.toObject();

      const formatted = {
        ...plain,
        _id: plain._id?.toString?.() || plain._id
      } as unknown as SystemInquiryDocument;

      return ResponseHelper<SystemInquiryDocument | null>(formatted, 201, null);
    } catch (error) {
      console.error('InquiriesService - Error creating inquiry:', error);
      return ResponseHelper<SystemInquiryDocument | null>(null, 500, error);
    }
  }
}
