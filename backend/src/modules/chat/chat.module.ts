import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatController } from './chat.controller';
import { GeminiService } from './service/gemini.service';

@Module({
  imports: [ConfigModule],
  controllers: [ChatController],
  providers: [GeminiService],
  exports: [GeminiService],
})
export class ChatModule {}
