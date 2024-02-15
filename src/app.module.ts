import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import {
  TypeOrmModule,
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { typeormOptions } from './database/data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${__dirname}/../.env`,
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...typeormOptions,
    }),
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
