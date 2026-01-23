import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth
} from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto';
import { JwtAuthGuard } from '../../common/guards';
import { GetUser } from '../../common/decorators';

@ApiTags('properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all properties' })
  @ApiResponse({
    status: 200,
    description: 'List of all properties',
    schema: {
      example: [
        {
          id: 1,
          title: 'Modern Apartment in Downtown',
          price: 250000,
          location: 'Bangkok, Thailand'
        }
      ]
    }
  })
  findAll() {
    // Public endpoint - anyone can view properties
    return this.propertiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get property by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Property ID' })
  @ApiResponse({
    status: 200,
    description: 'Property found',
    schema: {
      example: {
        id: 1,
        title: 'Modern Apartment in Downtown',
        price: 250000,
        location: 'Bangkok, Thailand'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Property not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    // Public endpoint - anyone can view a property
    return this.propertiesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new property' })
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: CreatePropertyDto })
  @ApiResponse({
    status: 201,
    description: 'Property created successfully',
    schema: {
      example: {
        id: 4,
        title: 'Beautiful House',
        price: 300000,
        location: 'Bangkok, Thailand'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  create(@Body() createPropertyDto: CreatePropertyDto, @GetUser() user: any) {
    console.log(user);
    // Protected endpoint - requires authentication
    return this.propertiesService.create(createPropertyDto);
  }
}
