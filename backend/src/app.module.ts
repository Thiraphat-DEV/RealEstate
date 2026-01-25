import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { FavouritesModule } from './modules/favourites/favourites.module';
import { MasterModule } from './modules/master/master.module';
import { InquiriesModule } from './modules/inquiries/inquiries.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { ViewHistoryModule } from './modules/view-history/view-history.module';
import { DatabaseModule } from './database/database.module';
import { appConfig, authConfig, databaseConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, authConfig, databaseConfig]
    }),
    DatabaseModule,
    AuthModule,
    PropertiesModule,
    FavouritesModule,
    MasterModule,
    InquiriesModule,
    ReviewsModule,
    ViewHistoryModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
