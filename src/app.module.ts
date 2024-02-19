import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormOptions } from './database/data-source';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ThrottlerModule } from '@nestjs/throttler';
import { MailModule } from './mail/mail.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${__dirname}/../.env`,
      isGlobal: true,
      load: [configuration],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    ThrottlerModule.forRoot([
      {
        name: 'login',
        ttl: 60000,
        limit: 5,
      },
    ]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...typeormOptions,
    }),
    AuthModule,
    MailModule,
  ],
})
export class AppModule {}
