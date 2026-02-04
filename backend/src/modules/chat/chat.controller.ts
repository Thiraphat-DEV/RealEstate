import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ChatMessageDto } from './dto';
import { GeminiService } from './service/gemini.service';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('message')
  @ApiOperation({ summary: 'Send a message to the Real Estate chat agent (Gemini)' })
  @ApiBody({ type: ChatMessageDto })
  @ApiResponse({ status: 200, description: 'Agent reply' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 503, description: 'Chat not configured' })
  async sendMessage(@Body() body: ChatMessageDto) {
    const reply = await this.geminiService.chat(body.message, body.history);
    return {
      data: { reply },
      length: 1,
      error: null,
      statusCode: 200,
    };
  }

  @Get('status')
  @ApiOperation({ summary: 'Check if chat agent is available' })
  @ApiResponse({ status: 200, description: 'Availability status' })
  async getStatus() {
    const available = this.geminiService.isAvailable();
    return {
      data: {
        available,
        hint: available
          ? null
          : 'Set GEMINI_API_KEY in backend/.env and restart the backend. See backend/CHAT_GEMINI_SETUP.md',
      },
      length: 1,
      error: null,
      statusCode: 200,
    };
  }
}
