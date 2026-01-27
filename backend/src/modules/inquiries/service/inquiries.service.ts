import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ServiceResponse, ResponseHelper } from 'src/common';
import {
  SystemInquiryEntity,
  SystemInquiryDocument
} from 'src/modules/schema/systems/inquiry.entity';
import { CreateInquiryDTO } from '../dto';
import { EmailService } from './email.service';

@Injectable()
export class InquiriesService {
  constructor(
    @InjectModel(SystemInquiryEntity.name)
    private readonly inquiryModel: Model<SystemInquiryDocument>,
    private readonly emailService: EmailService
  ) { }

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

      // Send confirmation email to the inquirer
      try {
        const emailSubject = 'Thank You for Your Inquiry - Real Estate Expert';
        const emailMessage = `
Dear ${body.name},

Thank you for contacting our property expert team. We have received your inquiry and will get back to you within 24 hours.

Your Inquiry Details:
- Name: ${body.name}
- Email: ${body.email}
${body.phone ? `- Phone: ${body.phone}` : ''}
- Question: ${body.question}

Our team is reviewing your inquiry and will provide you with expert advice soon.

Best regards,
Real Estate Expert Team
        `.trim();

        await this.emailService.sendEmail({
          email: body.email,
          subject: emailSubject,
          message: emailMessage
        });
      } catch (emailError) {
        // Email error - don't fail the inquiry creation
      }

      return ResponseHelper<SystemInquiryDocument | null>(formatted, 201, null);
    } catch (error) {
      return ResponseHelper<SystemInquiryDocument | null>(null, 500, error);
    }
  }

  async getAllInquiries(): Promise<ServiceResponse<SystemInquiryDocument[] | null>> {
    try {
      const inquiries = await this.inquiryModel
        .find()
        .sort({ createdAt: -1 })
        .exec();

      const formatted = inquiries.map((inquiry) => {
        const plain = inquiry.toObject();
        return {
          ...plain,
          _id: plain._id?.toString?.() || plain._id
        } as unknown as SystemInquiryDocument;
      });

      return ResponseHelper<SystemInquiryDocument[] | null>(formatted, 200, null);
    } catch (error) {
      return ResponseHelper<SystemInquiryDocument[] | null>(null, 500, error);
    }
  }

  async getInquiryById(id: string): Promise<ServiceResponse<SystemInquiryDocument | null>> {
    try {
      const inquiryResult: SystemInquiryDocument = (await this.inquiryModel.aggregate([{
        $match: {
          _id: new Types.ObjectId(id)
        }
      }]).exec())[0];

      if (!inquiryResult) {
        return ResponseHelper<SystemInquiryDocument | null>(null, 404, 'Inquiry not found');
      }

      return ResponseHelper<SystemInquiryDocument | null>(inquiryResult, 200, null);
    } catch (error) {
      return ResponseHelper<SystemInquiryDocument | null>(null, 500, error);
    }
  }

  async updateInquiryStatus(
    id: string,
    status: string
  ): Promise<ServiceResponse<SystemInquiryDocument | null>> {
    try {
      const inquiryResult: SystemInquiryDocument = await this.inquiryModel.findOneAndUpdate(
        { _id: new Types.ObjectId(id) },
        { status, updatedAt: new Date() },
        { new: true }
      ).exec();

      if (!inquiryResult) {
        return ResponseHelper<SystemInquiryDocument | null>(null, 404, 'Inquiry not found');
      }

      return ResponseHelper<SystemInquiryDocument | null>(inquiryResult, 200, null);
    } catch (error) {
      return ResponseHelper<SystemInquiryDocument | null>(null, 500, error);
    }
  }
}
