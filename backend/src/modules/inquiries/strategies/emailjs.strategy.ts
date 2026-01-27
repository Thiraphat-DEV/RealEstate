import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IEmailStrategy } from './email.strategy.interface';
import { ServiceResponse, ResponseHelper } from 'src/common';
import { SendEmailDTO } from '../dto';
import emailjs from '@emailjs/nodejs';

@Injectable()
export class EmailJSStrategy implements IEmailStrategy {
  private isInitialized: boolean = false;

  constructor(private configService: ConfigService) {
    const publicKey = this.configService.get<string>('EMAILJS_PUBLIC_KEY');
    const privateKey = this.configService.get<string>('EMAILJS_PRIVATE_KEY');

    if (publicKey && privateKey) {
      try {
        emailjs.init({
          publicKey,
          privateKey
        });
        this.isInitialized = true;
      } catch (error) {
        // Initialization failed
      }
    }
  }

  getName(): string {
    return 'EmailJS';
  }

  async sendEmail(
    emailData: SendEmailDTO
  ): Promise<ServiceResponse<{ messageId: string } | null>> {
    if (!this.isInitialized) {
      return ResponseHelper<{ messageId: string } | null>(
        null,
        500,
        'EmailJS is not initialized. Please check EMAILJS_PUBLIC_KEY and EMAILJS_PRIVATE_KEY in environment variables.'
      );
    }

    try {
      const serviceId = this.configService.get<string>('EMAILJS_SERVICE_ID');
      const templateId = this.configService.get<string>('EMAILJS_TEMPLATE_ID');

      if (!serviceId || !templateId) {
        return ResponseHelper<{ messageId: string } | null>(
          null,
          500,
          'EMAILJS_SERVICE_ID or EMAILJS_TEMPLATE_ID is not configured.'
        );
      }

      const templateParams: any = {
        to_email: emailData.email,
        subject: emailData.subject,
        message: emailData.message
      };

      const fromName = this.configService.get<string>('EMAILJS_FROM_NAME');
      if (fromName) {
        templateParams.from_name = fromName;
      }

      const replyTo = this.configService.get<string>('EMAILJS_REPLY_TO');
      if (replyTo) {
        templateParams.reply_to = replyTo;
      } else {
        templateParams.reply_to = emailData.email;
      }

      const response = await emailjs.send(serviceId, templateId, templateParams);

      if (response.status === 200) {
        return ResponseHelper<{ messageId: string } | null>(
          { messageId: response.text || `emailjs-${Date.now()}` },
          200,
          null
        );
      } else {
        const errorMsg = `EmailJS API returned status ${response.status}: ${response.text || 'Unknown error'}`;
        return ResponseHelper<{ messageId: string } | null>(
          null,
          500,
          errorMsg
        );
      }
    } catch (error) {
      let errorMessage = 'Failed to send email via EmailJS';
      if (error instanceof Error) {
        errorMessage = error.message;
        if (error.message.includes('Invalid template')) {
          errorMessage = 'EmailJS Template ID is invalid. Please check EMAILJS_TEMPLATE_ID.';
        } else if (error.message.includes('Invalid service')) {
          errorMessage = 'EmailJS Service ID is invalid. Please check EMAILJS_SERVICE_ID.';
        } else if (error.message.includes('Invalid public key')) {
          errorMessage = 'EmailJS Public Key is invalid. Please check EMAILJS_PUBLIC_KEY.';
        } else if (error.message.includes('Invalid private key')) {
          errorMessage = 'EmailJS Private Key is invalid. Please check EMAILJS_PRIVATE_KEY.';
        } else if (error.message.includes('rate limit') || error.message.includes('quota')) {
          errorMessage = 'EmailJS rate limit exceeded. Please check your EmailJS plan limits.';
        }
      }

      return ResponseHelper<{ messageId: string } | null>(
        null,
        500,
        errorMessage
      );
    }
  }

  async sendTestEmail(
    email: string
  ): Promise<ServiceResponse<{ messageId: string; testInfo: any } | null>> {
    if (!this.isInitialized) {
      return ResponseHelper<{ messageId: string; testInfo: any } | null>(
        null,
        500,
        'EmailJS is not initialized. Please check EMAILJS_PUBLIC_KEY and EMAILJS_PRIVATE_KEY in environment variables.'
      );
    }

    try {
      const testSubject = 'Test Email from Real Estate API';
      const testMessage = `
This is a test email from Real Estate API.

If you received this email, it means the EmailJS service is working correctly!

Test Details:
- Service: EmailJS
- Sent at: ${new Date().toISOString()}
      `.trim();

      const result = await this.sendEmail({
        email,
        subject: testSubject,
        message: testMessage
      });

      if (result.statusCode === 200 && result.data) {
        return ResponseHelper<{ messageId: string; testInfo: any } | null>(
          {
            messageId: result.data.messageId,
            testInfo: {
              service: 'EmailJS',
              sent: true,
              timestamp: new Date().toISOString()
            }
          },
          200,
          null
        );
      }

      return result as ServiceResponse<{ messageId: string; testInfo: any } | null>;
    } catch (error) {
      return ResponseHelper<{ messageId: string; testInfo: any } | null>(
        null,
        500,
        error instanceof Error ? error.message : 'Failed to send test email via EmailJS'
      );
    }
  }

  async verifyConnection(): Promise<{ success: boolean; error?: string }> {
    if (!this.isInitialized) {
      return {
        success: false,
        error: 'EmailJS is not initialized. Please check EMAILJS_PUBLIC_KEY and EMAILJS_PRIVATE_KEY.'
      };
    }

    const serviceId = this.configService.get<string>('EMAILJS_SERVICE_ID');
    const templateId = this.configService.get<string>('EMAILJS_TEMPLATE_ID');

    if (!serviceId || !templateId) {
      return {
        success: false,
        error: 'EMAILJS_SERVICE_ID or EMAILJS_TEMPLATE_ID is not configured.'
      };
    }

    return { success: true };
  }
}
