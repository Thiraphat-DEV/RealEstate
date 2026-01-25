import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ReviewsService } from '../service/reviews.service';
import { CreateReviewDTO } from '../dto';
import { JwtAuthGuard, OptionalJwtAuthGuard } from '../../../common/guards';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a review for a property' })
  @ApiBody({ type: CreateReviewDTO })
  @ApiResponse({
    status: 201,
    description: 'Review created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createReview(@Body() body: CreateReviewDTO) {
    return await this.reviewsService.createReview(body);
  }

  @Get('property/:propertyId')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get all reviews for a property' })
  @ApiParam({ name: 'propertyId', type: 'string', description: 'Property ID' })
  @ApiResponse({
    status: 200,
    description: 'List of reviews',
  })
  async getReviewsByPropertyId(@Param('propertyId') propertyId: string) {
    return await this.reviewsService.getReviewsByPropertyId(propertyId);
  }

  @Get('property/:propertyId/rating')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get rating data for a property' })
  @ApiParam({ name: 'propertyId', type: 'string', description: 'Property ID' })
  @ApiResponse({
    status: 200,
    description: 'Rating data',
  })
  async getRatingDataByPropertyId(@Param('propertyId') propertyId: string) {
    return await this.reviewsService.getRatingDataByPropertyId(propertyId);
  }

  @Get('property/:propertyId/rating/median')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get median rating for a property' })
  @ApiParam({ name: 'propertyId', type: 'string', description: 'Property ID' })
  @ApiResponse({
    status: 200,
    description: 'Median rating',
  })
  async getMedianRatingByPropertyId(@Param('propertyId') propertyId: string) {
    return await this.reviewsService.getMedianRatingByPropertyId(propertyId);
  }
}
