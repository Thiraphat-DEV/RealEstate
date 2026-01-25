import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddressService } from '../service/address.service';

@ApiTags('master')
@Controller('master/addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  @ApiOperation({
    summary: 'Get master addresses with optional city/area filters'
  })
  @ApiResponse({
    status: 200,
    description: 'List of addresses'
  })
  async getAddresses(
    @Query('city') city?: string,
    @Query('area') area?: string
  ) {
    return this.addressService.getAddresses({ city, area });
  }
}
