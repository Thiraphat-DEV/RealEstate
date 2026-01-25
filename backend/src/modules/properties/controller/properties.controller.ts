import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PropertiesService } from '../service/properties.service';
import { GetPropertiesFilterDTO } from '../dto';

@ApiTags('properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all properties' })
  @ApiResponse({
    status: 200,
    description: 'List of all properties'
  })
  async getAllProperties(@Query() query: GetPropertiesFilterDTO) {
    const response = await this.propertiesService.getAllProperties(query);
    return response || [];
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get property by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Property ID' })
  @ApiResponse({
    status: 200,
    description: 'Property found'
  })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async getPropertyById(@Param('id') id: string) {
    return await this.propertiesService.getPropertyById(id);
  }
}
