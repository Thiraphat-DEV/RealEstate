import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetPropertiesFilterDTO {
  @ApiProperty({
    description: 'Filter by location or city name',
    required: false
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'Filter by address keyword',
    required: false
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Filter by property type id',
    required: false
  })
  @IsOptional()
  @IsString()
  propertyType?: string;

  @ApiProperty({
    description: 'Minimum price',
    required: false,
    type: Number
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceMin?: number;

  @ApiProperty({
    description: 'Maximum price',
    required: false,
    type: Number
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceMax?: number;

  @ApiProperty({
    description: 'Minimum bedrooms',
    required: false,
    type: Number
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bedrooms?: number;

  @ApiProperty({
    description: 'Minimum bathrooms',
    required: false,
    type: Number
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bathrooms?: number;

  @ApiProperty({
    description: 'Minimum area (ตารางเมตร)',
    required: false,
    type: Number
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  areaMin?: number;

  @ApiProperty({
    description: 'Maximum area (ตารางเมตร)',
    required: false,
    type: Number
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  areaMax?: number;

  @ApiProperty({
    description: 'Page number',
    required: false,
    type: Number,
    default: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: 'Page Limit',
    required: false,
    type: Number,
    default: 20
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageLimit?: number;

  @ApiProperty({
    required: false,
    type: String
  })
  @IsOptional()
  @IsString()
  search?: string;
}
