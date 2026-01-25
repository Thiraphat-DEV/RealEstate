import { Module } from '@nestjs/common';
import { BedroomService } from './service/bedroom.service';
import { BedroomController } from './controller/bedroom.controller';

@Module({
  providers: [BedroomService],
  controllers: [BedroomController],
  exports: [BedroomService]
})
export class BedroomModule {}
