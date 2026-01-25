import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
  UnauthorizedException
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OptionalJwtAuthGuard } from '../../../common/guards';
import { GetUser } from '../../../common/decorators';
import { ViewHistoryService } from '../service/view-history.service';
import { RecordViewDto, RemoveViewDto } from '../dto/view-history.dto';

@ApiTags('view-history')
@Controller('view-history')
@UseGuards(OptionalJwtAuthGuard)
export class ViewHistoryController {
  constructor(private readonly viewHistoryService: ViewHistoryService) {}

  @Post('record')
  @ApiOperation({ summary: 'Record a property view for the current user' })
  @ApiBody({ type: RecordViewDto })
  @ApiResponse({
    status: 200,
    description: 'View history updated'
  })
  @ApiResponse({
    status: 201,
    description: 'View history created'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Login required'
  })
  async recordView(@GetUser() user: any, @Body() body: RecordViewDto) {
    if (!user) {
      throw new UnauthorizedException('Login required to record view history');
    }
    const userId = user?.id || user?._id;
    return this.viewHistoryService.recordView(userId, body.propertyId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all viewed properties for current user' })
  @ApiResponse({
    status: 200,
    description: 'List of viewed properties for the authenticated user'
  })
  async getMyViewHistory(@GetUser() user: any) {
    const userId = user?.id || user?._id;
    return this.viewHistoryService.getUserViewHistory(userId);
  }

  @Patch('remove')
  @ApiOperation({ summary: 'Remove a property view for the current user' })
  @ApiBody({ type: RemoveViewDto })
  @ApiResponse({
    status: 200,
    description: 'View history removed'
  })
  async removeVieProperty(@GetUser() user: any, @Body() body: RemoveViewDto) {
    const userId = user?.id || user?._id;
    return this.viewHistoryService.removeViewProperty(
      userId,
      body.viewHistoryId
    );
  }
}
