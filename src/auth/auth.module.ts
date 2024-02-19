import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Otp } from './entities/otp.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Otp]),
    PassportModule,
    MailModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwtConfig = configService.get('jwt');
        return {
          global: true,
          secret: jwtConfig.secret,
          signOptions: {
            expiresIn: jwtConfig.expiresIn,
          },
        };
      },
    }),
  ],
  providers: [AuthResolver, AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
