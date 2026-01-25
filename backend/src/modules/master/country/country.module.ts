import { Module } from '@nestjs/common';
import { MasterSchemaModule } from '../../schema/master/master-schema.module';
import { CountryService } from './service/country.service';
import { CountryController } from './controller/country.controller';

@Module({
  imports: [MasterSchemaModule],
  providers: [CountryService],
  controllers: [CountryController],
  exports: [CountryService]
})
export class CountryModule {}
