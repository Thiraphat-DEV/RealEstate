import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { InquiriesService } from './service/inquiries.service';
import { EmailService } from './service/email.service';
import { InquiriesController } from './controller/inquiries.controller';
import { EmailJSStrategy } from './strategies';
import {
  SystemInquiryEntity,
  SystemInquirySchema
} from '../schema/systems/inquiry.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SystemInquiryEntity.name, schema: SystemInquirySchema }
    ]),
    ConfigModule
  ],
  providers: [InquiriesService, EmailService, EmailJSStrategy],
  controllers: [InquiriesController],
  exports: [InquiriesService, EmailService]
})
export class InquiriesModule {}
