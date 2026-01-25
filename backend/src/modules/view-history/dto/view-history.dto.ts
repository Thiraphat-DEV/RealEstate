import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class RecordViewDto {
  @ApiProperty({
    description: 'Property ID to record view history',
    example: '60f7f9b9c25e4b3d88e3b8b1'
  })
  @IsMongoId()
  propertyId: string;
}

export class RemoveViewDto {
  @ApiProperty({
    description: 'View history ID to remove',
    example: '60f7f9b9c25e4b3d88e3b8b1'
  })
  @IsMongoId()
  viewHistoryId: string;
}
