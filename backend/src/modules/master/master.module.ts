import { Module } from '@nestjs/common';
import { PropertyTypeModule } from './property-type/property-type.module';
import { CountryModule } from './country/country.module';
import { BedroomModule } from './bedroom/bedroom.module';
import { AddressModule } from './address/address.module';

@Module({
  imports: [PropertyTypeModule, CountryModule, BedroomModule, AddressModule]
})
export class MasterModule {}
