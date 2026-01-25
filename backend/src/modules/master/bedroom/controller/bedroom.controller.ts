import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BedroomService } from '../service/bedroom.service';

@ApiTags('master')
@Controller('master/bedrooms')
export class BedroomController {
  constructor(private readonly bedroomService: BedroomService) {}

  @Get()
  @ApiOperation({ summary: 'Get bedroom options master data' })
  @ApiResponse({
    status: 200,
    description: 'List of bedroom options'
  })
  async getBedroomOptions() {
    return this.bedroomService.getBedroomOptions();
  }
}
