import { ServiceResponse } from 'src/common';
import { SendEmailDTO } from '../dto';

export interface IEmailStrategy {
  sendEmail(emailData: SendEmailDTO): Promise<ServiceResponse<{ messageId: string } | null>>;
  sendTestEmail(email: string): Promise<ServiceResponse<{ messageId: string; testInfo: any } | null>>;
  verifyConnection(): Promise<{ success: boolean; error?: string }>;
  getName(): string;
}
