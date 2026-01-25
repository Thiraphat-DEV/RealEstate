import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class GetPropertyDTO {
  @ApiProperty({
    required: true,
    type: Types.ObjectId,
    description: 'Property ID'
  })
  id: Types.ObjectId;
}
