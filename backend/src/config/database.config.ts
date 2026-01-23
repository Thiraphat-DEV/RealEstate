import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'mongodb',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '27017',
  username: process.env.DB_USERNAME || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'realestate',
  ssl: process.env.DB_SSL === 'true'
}));
