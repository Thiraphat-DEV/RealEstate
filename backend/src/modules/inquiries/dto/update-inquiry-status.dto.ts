import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class UpdateInquiryStatusDTO {
  @ApiProperty({
    description: 'Inquiry status',
    example: 'pending',
    enum: ['pending', 'in_progress', 'resolved', 'closed']
  })
  @IsString()
  @IsIn(['pending', 'in_progress', 'resolved', 'closed'])
  status: string;
}
