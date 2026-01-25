import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewsService } from './service/reviews.service';
import { ReviewsController } from './controller/reviews.controller';
import {
  PropertyReviewEntity,
  PropertyReviewSchema
} from '../schema/systems/property-review.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PropertyReviewEntity.name, schema: PropertyReviewSchema }
    ])
  ],
  providers: [ReviewsService],
  controllers: [ReviewsController],
  exports: [ReviewsService]
})
export class ReviewsModule {}
