import { UserEntity, UserSchema } from './schema/user.entity';
import {
  UserTransactionEntity,
  UserTransactionSchema
} from './schema/Logging/user_transaction.entity';
import {
  FavouritesPropertyEntity,
  FavouritesPropertySchema
} from './schema/systems/favourite-property.entity';
import {
  MasterCityEntity,
  MasterCitySchema
} from './schema/master/ms_city.entity';
import {
  MasterAddressEntity,
  MasterAddressSchema
} from './schema/master/ms_address.entity';
import {
  MasterPropertiesStatusEntity,
  MasterPropertiesStatusSchema
} from './schema/master/ms_properties_status.entity';
import {
  MasterPropertiesTypeEntity,
  MasterPropertiesTypeSchema
} from './schema/master/ms_properties_type.entity';
import {
  MasterPropertiesEntity,
  MasterPropertiesSchema
} from './schema/master/ms_properties.entity';

export const schemaTemplate = [
  {
    name: UserEntity.name,
    schema: UserSchema
  },
  {
    name: UserTransactionEntity.name,
    schema: UserTransactionSchema
  },
  {
    name: FavouritesPropertyEntity.name,
    schema: FavouritesPropertySchema
  },
  {
    name: MasterCityEntity.name,
    schema: MasterCitySchema
  },
  {
    name: MasterAddressEntity.name,
    schema: MasterAddressSchema
  },
  {
    name: MasterPropertiesStatusEntity.name,
    schema: MasterPropertiesStatusSchema
  },
  {
    name: MasterPropertiesTypeEntity.name,
    schema: MasterPropertiesTypeSchema
  },
  {
    name: MasterPropertiesEntity.name,
    schema: MasterPropertiesSchema
  }
];
