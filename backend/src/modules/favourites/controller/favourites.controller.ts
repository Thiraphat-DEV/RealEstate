import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UnauthorizedException
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { OptionalJwtAuthGuard } from '../../../common/guards';
import { GetUser } from '../../../common/decorators';
import { FavouritesService } from '../service/favourites.service';
import { ToggleFavouriteDto } from '../dto/favourite.dto';

@ApiTags('favourites')
@Controller('favourites')
@UseGuards(OptionalJwtAuthGuard)
export class FavouritesController {
  constructor(private readonly favouritesService: FavouritesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all favourite properties for current user' })
  @ApiResponse({
    status: 200,
    description: 'List of favourite properties for the authenticated user'
  })
  async getMyFavourites(@GetUser() user: any) {
    const userId = user?.id || user?._id;
    return this.favouritesService.getUserFavourites(userId);
  }

  @Post('toggle')
  @ApiOperation({ summary: 'Toggle favourite for a property (add/remove)' })
  @ApiBody({ type: ToggleFavouriteDto })
  @ApiResponse({
    status: 200,
    description: 'Favourite removed'
  })
  @ApiResponse({
    status: 201,
    description: 'Favourite created'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Login required'
  })
  async toggleFavourite(
    @GetUser() user: any,
    @Body() body: ToggleFavouriteDto
  ) {
    if (!user) {
      throw new UnauthorizedException('Login required to toggle favourite');
    }
    const userId = user?.id || user?._id;
    return this.favouritesService.toggleFavourite(userId, body.propertyId);
  }

  @Get('status')
  @ApiOperation({
    summary: 'Check if a property is favourited by the current user'
  })
  @ApiQuery({ name: 'propertyId', type: 'string', required: true })
  @ApiResponse({
    status: 200,
    description: 'Returns whether the property is favourited'
  })
  async isFavourite(
    @GetUser() user: any,
    @Query('propertyId') propertyId: string
  ) {
    if (!user) {
      return { data: { isFavourite: false }, statusCode: 200, error: null };
    }
    const userId = user?.id || user?._id;
    return this.favouritesService.isFavourite(userId, propertyId);
  }
}
