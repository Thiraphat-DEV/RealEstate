import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth
} from '@nestjs/swagger';
import { ReviewsService } from '../service/reviews.service';
import { CreateReviewDTO } from '../dto';
import { JwtAuthGuard } from '../../../common/guards';

@ApiTags('reviews')
@Controller('reviews')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a review for a property' })
  @ApiBody({ type: CreateReviewDTO })
  @ApiResponse({
    status: 201,
    description: 'Review created successfully'
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createReview(@Body() body: CreateReviewDTO) {
    return await this.reviewsService.createReview(body);
  }

  @Get('property/:propertyId')
  @ApiOperation({ summary: 'Get all reviews for a property' })
  @ApiParam({ name: 'propertyId', type: 'string', description: 'Property ID' })
  @ApiResponse({
    status: 200,
    description: 'List of reviews'
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getReviewsByPropertyId(@Param('propertyId') propertyId: string) {
    return await this.reviewsService.getReviewsByPropertyId(propertyId);
  }

  @Get('property/:propertyId/rating')
  @ApiOperation({ summary: 'Get rating data for a property' })
  @ApiParam({ name: 'propertyId', type: 'string', description: 'Property ID' })
  @ApiResponse({
    status: 200,
    description: 'Rating data'
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getRatingDataByPropertyId(@Param('propertyId') propertyId: string) {
    return await this.reviewsService.getRatingDataByPropertyId(propertyId);
  }

  @Get('property/:propertyId/rating/median')
  @ApiOperation({ summary: 'Get median rating for a property' })
  @ApiParam({ name: 'propertyId', type: 'string', description: 'Property ID' })
  @ApiResponse({
    status: 200,
    description: 'Median rating'
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMedianRatingByPropertyId(@Param('propertyId') propertyId: string) {
    return await this.reviewsService.getMedianRatingByPropertyId(propertyId);
  }
}
