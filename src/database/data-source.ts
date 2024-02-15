import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config({ path: __dirname + '/../../.env' });
const typeormOptions: DataSourceOptions = {
  type: process.env.DATABASE_TYPE,
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  entities: [__dirname + '/../../dist/**/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../../dist/database/migrations/*{.ts,.js}'],
  logging: true,
} as DataSourceOptions;

export default new DataSource({
  ...typeormOptions,
});

export { typeormOptions };
