import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { InquiriesService } from '../service/inquiries.service';
import { CreateInquiryDTO } from '../dto';

@ApiTags('inquiries')
@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Post()
  @ApiOperation({ summary: 'Submit an inquiry (Ask Guru)' })
  @ApiBody({ type: CreateInquiryDTO })
  @ApiResponse({
    status: 201,
    description: 'Inquiry submitted successfully'
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  async createInquiry(@Body() body: CreateInquiryDTO) {
    return await this.inquiriesService.createInquiry(body);
  }
}
