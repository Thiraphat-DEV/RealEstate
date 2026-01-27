import { Controller, Post, Body, Get, Query, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import { InquiriesService } from '../service/inquiries.service';
import { EmailService } from '../service/email.service';
import { CreateInquiryDTO, SendEmailDTO, UpdateInquiryStatusDTO } from '../dto';

@ApiTags('inquiries')
@Controller('inquiries')
export class InquiriesController {
  constructor(
    private readonly inquiriesService: InquiriesService,
    private readonly emailService: EmailService
  ) {}

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

  @Post('send-email')
  @ApiOperation({ summary: 'Send email to recipient' })
  @ApiBody({ type: SendEmailDTO })
  @ApiResponse({
    status: 200,
    description: 'Email sent successfully'
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 500, description: 'Internal server error - failed to send email' })
  async sendEmail(@Body() body: SendEmailDTO) {
    return await this.emailService.sendEmail(body);
  }

  @Get('test-email')
  @ApiOperation({ summary: 'Test email sending functionality' })
  @ApiQuery({
    name: 'email',
    required: true,
    description: 'Email address to send test email to',
    example: 'test@example.com'
  })
  @ApiResponse({
    status: 200,
    description: 'Test email sent successfully'
  })
  @ApiResponse({ status: 400, description: 'Bad request - email parameter required' })
  @ApiResponse({ status: 500, description: 'Internal server error - failed to send test email' })
  async testEmail(@Query('email') email: string) {
    if (!email) {
      return {
        data: null,
        length: 0,
        error: 'Email parameter is required',
        statusCode: 400
      };
    }
    return await this.emailService.sendTestEmail(email);
  }

  @Get('verify-smtp')
  @ApiOperation({ summary: 'Verify SMTP connection' })
  @ApiResponse({
    status: 200,
    description: 'SMTP connection status'
  })
  async verifySmtp() {
    const connectionResult = await this.emailService.verifyConnection();
    const currentStrategy = this.emailService.getCurrentStrategy();
    const emailjsPublicKey = process.env.EMAILJS_PUBLIC_KEY || '';
    const emailjsServiceId = process.env.EMAILJS_SERVICE_ID || '';
    const emailjsTemplateId = process.env.EMAILJS_TEMPLATE_ID || '';
    
    const isConnected = connectionResult.success;
    
    return {
      data: {
        connected: isConnected,
        strategy: currentStrategy,
        service: 'EmailJS',
        hasAuth: true,
        isRealEmail: true,
        error: connectionResult.error || null,
        config: {
          hasPublicKey: !!emailjsPublicKey,
          hasServiceId: !!emailjsServiceId,
          hasTemplateId: !!emailjsTemplateId,
          serviceId: emailjsServiceId || 'Not set',
          templateId: emailjsTemplateId || 'Not set'
        },
      },
      length: 1,
      error: connectionResult.error || null,
      statusCode: isConnected ? 200 : 500
    };
  }

  @Get('debug-template-params')
  @ApiOperation({ summary: 'Debug: Show template parameters that will be sent to EmailJS' })
  @ApiQuery({
    name: 'email',
    required: true,
    description: 'Email address to test',
    example: 'test@example.com'
  })
  @ApiResponse({
    status: 200,
    description: 'Template parameters preview'
  })
  async debugTemplateParams(@Query('email') email: string) {
    if (!email) {
      return {
        data: null,
        length: 0,
        error: 'Email parameter is required',
        statusCode: 400
      };
    }

    const templateParams = {
      to_email: email,
      subject: 'Test Subject',
      message: 'Test message content',
      from_name: process.env.EMAILJS_FROM_NAME || 'Real Estate API',
      reply_to: process.env.EMAILJS_REPLY_TO || email
    };

    return {
      data: {
        templateParams,
        serviceId: process.env.EMAILJS_SERVICE_ID || 'Not set',
        templateId: process.env.EMAILJS_TEMPLATE_ID || 'Not set',
        instructions: {
          step1: 'Go to EmailJS Dashboard > Email Templates',
          step2: `Open template with ID: ${process.env.EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID'}`,
          step3: 'Check "To Email" field - MUST be exactly: {{to_email}}',
          step4: 'Make sure template uses these variables:',
          variables: {
            '{{to_email}}': templateParams.to_email,
            '{{subject}}': templateParams.subject,
            '{{message}}': templateParams.message,
            '{{from_name}}': templateParams.from_name,
            '{{reply_to}}': templateParams.reply_to
          },
          warning: '⚠️ If To Email field is empty or set to a fixed email, all emails will go to that address!'
        }
      },
      length: 1,
      error: null,
      statusCode: 200
    };
  }

  @Post('test-real-email')
  @ApiOperation({ summary: 'Test sending email to real email address' })
  @ApiBody({ 
    type: SendEmailDTO,
    description: 'Email data to send to real email address'
  })
  @ApiResponse({
    status: 200,
    description: 'Email sent successfully to real inbox'
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 500, description: 'Internal server error - failed to send email' })
  async testRealEmail(@Body() body: SendEmailDTO) {
    const result = await this.emailService.sendEmail(body);
    
    // Add instructions for checking email
    if (result.statusCode === 200 && result.data) {
      return {
        ...result,
        instructions: {
          message: 'Email sent successfully!',
          checkInbox: `Please check the inbox of ${body.email}`,
          checkSpam: 'Also check Spam/Junk folder if not found in inbox',
          waitTime: 'Email may take 1-2 minutes to arrive',
          messageId: result.data.messageId
        }
      };
    }
    
    return result;
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all inquiries (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'List of all inquiries'
  })
  async getAllInquiries() {
    return await this.inquiriesService.getAllInquiries();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get inquiry by ID' })
  @ApiParam({ name: 'id', description: 'Inquiry ID' })
  @ApiResponse({
    status: 200,
    description: 'Inquiry details'
  })
  @ApiResponse({ status: 404, description: 'Inquiry not found' })
  async getInquiryById(@Param('id') id: string) {
    return await this.inquiriesService.getInquiryById(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update inquiry status (Admin)' })
  @ApiParam({ name: 'id', description: 'Inquiry ID' })
  @ApiBody({ type: UpdateInquiryStatusDTO })
  @ApiResponse({
    status: 200,
    description: 'Inquiry status updated successfully'
  })
  @ApiResponse({ status: 404, description: 'Inquiry not found' })
  async updateInquiryStatus(
    @Param('id') id: string,
    @Body() body: UpdateInquiryStatusDTO
  ) {
    return await this.inquiriesService.updateInquiryStatus(id, body.status);
  }
}
