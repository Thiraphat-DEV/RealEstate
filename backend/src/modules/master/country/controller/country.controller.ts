import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CountryService } from '../service/country.service';

@ApiTags('master')
@Controller('master/countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all countries master data' })
  @ApiResponse({
    status: 200,
    description: 'List of countries'
  })
  async getCountries() {
    return this.countryService.getCountries();
  }

  @Get('cities')
  @ApiOperation({ summary: 'Get all cities with _id for filtering' })
  @ApiResponse({
    status: 200,
    description: 'List of cities with id, code, name'
  })
  async getCities() {
    return this.countryService.getCities();
  }
}
