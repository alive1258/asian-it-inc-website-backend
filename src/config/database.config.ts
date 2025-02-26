import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  environment: process.env.NODE_ENV || 'production',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '') || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  name: process.env.DB_NAME,
  synchronize: process.env.DB_SYNC === 'true',
  autoLoadEntities: process.env.DB_AUTO_LOAD_ENTITIES === 'true',
}));
