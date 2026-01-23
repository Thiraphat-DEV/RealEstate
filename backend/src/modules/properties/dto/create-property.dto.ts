import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePropertyDto {
  @ApiProperty({
    example: 'Modern Apartment in Downtown',
    description: 'Property title'
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 250000,
    description: 'Property price',
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 'Bangkok, Thailand',
    description: 'Property location'
  })
  @IsString()
  @IsNotEmpty()
  location: string;
}
