import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class CreateInquiryDTO {
  @ApiProperty({ description: 'Name of the inquirer', example: 'John Doe' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john.doe@example.com'
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '081-234-5678'
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Question or inquiry message',
    example: 'What is the best area to invest in Bangkok?'
  })
  @IsString()
  @MinLength(10)
  question: string;
}
