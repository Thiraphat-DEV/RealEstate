import { Module } from '@nestjs/common';
import { MasterSchemaModule } from '../../schema/master/master-schema.module';
import { AddressService } from './service/address.service';
import { AddressController } from './controller/address.controller';

@Module({
  imports: [MasterSchemaModule],
  providers: [AddressService],
  controllers: [AddressController],
  exports: [AddressService]
})
export class AddressModule {}
