import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PropertyTypeService } from '../service/property-type.service';

@ApiTags('master')
@Controller('master/property-types')
export class PropertyTypeController {
  constructor(private readonly propertyTypeService: PropertyTypeService) {}

  @Get()
  @ApiOperation({ summary: 'Get all property types master data' })
  @ApiResponse({
    status: 200,
    description: 'List of property types'
  })
  async getPropertyTypes() {
    return this.propertyTypeService.getPropertyTypes();
  }
}
