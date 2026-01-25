import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class CreateReviewDTO {
  @ApiProperty({
    description: 'Property ID',
    required: true
  })
  @IsString()
  propertyId: string;

  @ApiProperty({
    description: 'Rating (1-5)',
    required: true,
    minimum: 1,
    maximum: 5
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    description: 'Review comment',
    required: false
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
