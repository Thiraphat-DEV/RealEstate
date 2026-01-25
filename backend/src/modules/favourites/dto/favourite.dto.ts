import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class ToggleFavouriteDto {
  @ApiProperty({
    description: 'Property ID to add or remove from favourites',
    example: '60f7f9b9c25e4b3d88e3b8b1'
  })
  @IsMongoId()
  propertyId: string;
}
