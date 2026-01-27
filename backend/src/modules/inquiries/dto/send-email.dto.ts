import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength } from 'class-validator';

export class SendEmailDTO {
  @ApiProperty({
    description: 'Email address to send to',
    example: 'recipient@example.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Email subject',
    example: 'Property Inquiry Response'
  })
  @IsString()
  @MinLength(3)
  subject: string;

  @ApiProperty({
    description: 'Email message body',
    example: 'Thank you for your inquiry. We will get back to you soon.'
  })
  @IsString()
  @MinLength(10)
  message: string;
}
