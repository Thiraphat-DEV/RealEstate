import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InquiriesService } from './service/inquiries.service';
import { InquiriesController } from './controller/inquiries.controller';
import {
  SystemInquiryEntity,
  SystemInquirySchema
} from '../schema/systems/inquiry.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SystemInquiryEntity.name, schema: SystemInquirySchema }
    ])
  ],
  providers: [InquiriesService],
  controllers: [InquiriesController],
  exports: [InquiriesService]
})
export class InquiriesModule {}
