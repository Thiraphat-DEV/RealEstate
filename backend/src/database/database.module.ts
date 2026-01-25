import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('DB_HOST') || 'localhost';
        const port = configService.get<string>('DB_PORT') || '27017';
        const username = configService.get<string>('DB_USERNAME') || '';
        const password = configService.get<string>('DB_PASSWORD') || '';
        const database = configService.get<string>('DB_NAME') || 'realestate';
        const sslEnabled = configService.get<string>('DB_SSL') === 'true';

        let uri: string;
        if (username && password) {
          uri = `mongodb://${username}:${encodeURIComponent(password)}@${host}:${port}/${database}?authSource=admin`;
        } else {
          uri = `mongodb://${host}:${port}/${database}`;
        }

        const options: any = {
          retryWrites: true,
          w: 'majority'
        };

        if (sslEnabled) {
          options.tls = true;
          options.tlsAllowInvalidCertificates = true;
        }

        // Add connection options for better reliability
        options.connectTimeoutMS = 10000;
        options.socketTimeoutMS = 45000;
        options.serverSelectionTimeoutMS = 10000;

        return {
          uri,
          ...options
        };
      },
      inject: [ConfigService]
    })
  ]
})
export class DatabaseModule {}
