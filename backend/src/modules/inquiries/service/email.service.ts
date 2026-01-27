import { Injectable } from '@nestjs/common';
import { ServiceResponse } from 'src/common';
import { SendEmailDTO } from '../dto';
import { EmailJSStrategy } from '../strategies';

@Injectable()
export class EmailService {
  constructor(private emailJSStrategy: EmailJSStrategy) {}

  async sendEmail(
    emailData: SendEmailDTO
  ): Promise<ServiceResponse<{ messageId: string } | null>> {
    return await this.emailJSStrategy.sendEmail(emailData);
  }

  async verifyConnection(): Promise<{ success: boolean; error?: string }> {
    return await this.emailJSStrategy.verifyConnection();
  }

  async sendTestEmail(
    email: string
  ): Promise<ServiceResponse<{ messageId: string; testInfo: any } | null>> {
    return await this.emailJSStrategy.sendTestEmail(email);
  }

  getCurrentStrategy(): string {
    return this.emailJSStrategy.getName();
  }
}
