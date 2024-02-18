import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterInput } from './inputs/register.input';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordInput } from './inputs/change-password.input';
import { Messages } from 'src/common/constants';
import { ForgotPasswordInput } from './inputs/forgot-password.input';
import { otpTypeEnum } from './enums/otp-type.enum';
import { Otp } from './entities/otp.entity';
import { generateOtp } from 'src/common/utils';
import { ResetPasswordInput } from './inputs/reset-password.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
  ) {}

  getJwt(user: User): string {
    const payload = {
      sub: user.id,
      username: user.email,
    };
    return this.jwtService.sign(payload);
  }

  async register(registerInput: RegisterInput): Promise<User> {
    try {
      registerInput.password = await bcrypt.hash(registerInput.password, 10);
      await this.usersRepository.insert(registerInput);
      return registerInput;
    } catch (err) {
      if (err instanceof QueryFailedError)
        throw new InternalServerErrorException(err);
      throw new BadRequestException(err);
    }
  }

  async changePassword(
    changePasswordInput: ChangePasswordInput,
    user: User,
  ): Promise<string> {
    try {
      const foundUser: User = await this.usersRepository.findOneByOrFail({
        email: user.email,
      });

      if (
        await bcrypt.compare(
          changePasswordInput.oldPassword,
          foundUser.password,
        )
      ) {
        await this.usersRepository.update(
          { email: user.email },
          {
            password: await bcrypt.hash(changePasswordInput.newPassword, 10),
          },
        );
        return 'Password changed successfully.';
      } else {
        throw new UnauthorizedException(Messages.WRONG_CREDENTIALS);
      }
    } catch (err) {
      if (
        err instanceof UnauthorizedException ||
        err instanceof InternalServerErrorException
      ) {
        throw err;
      }
      throw new BadRequestException(err);
    }
  }

  async forgotPassword(
    forgotPasswordInput: ForgotPasswordInput,
  ): Promise<string> {
    try {
      const foundUser: User = await this.usersRepository.findOneBy({
        email: forgotPasswordInput.email,
      });

      if (!foundUser) {
        throw new NotFoundException(Messages.USER_NOT_FOUND);
      }
      const otp: string = await generateOtp();

      await this.dataSource.transaction(async (manager) => {
        await manager.update(
          Otp,
          {
            email: forgotPasswordInput.email,
          },
          {
            is_active: false,
          },
        );

        await manager.insert(Otp, {
          email: forgotPasswordInput.email,
          otp,
          otp_type: otpTypeEnum.forgotPassword,
          is_active: true,
          created_at: new Date(),
        });
      });

      return otp;
    } catch (err) {
      if (
        err instanceof NotFoundException ||
        err instanceof InternalServerErrorException
      ) {
        throw err;
      }
      throw new BadRequestException(err);
    }
  }

  async resetPassword(resetPassInput: ResetPasswordInput): Promise<string> {
    try {
      const foundOtp: Otp = await this.otpRepository.findOneBy({
        email: resetPassInput.email,
        otp: resetPassInput.otp,
        is_active: true
      });

      const currentTime: number = new Date().getTime();
      const otpCreatedTime: number = new Date(foundOtp?.created_at).getTime();
      const isValidInterval: boolean = currentTime - otpCreatedTime < 30000;

      if (!foundOtp || !isValidInterval)
        throw new BadRequestException(Messages.INVALID_OTP);

      const newPassword: string = await bcrypt.hash(
        resetPassInput.password,
        10,
      );

      await this.usersRepository.update(
        {
          email: resetPassInput.email,
        },
        {
          password: newPassword,
        },
      );

      return 'Password has been reset';
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new BadRequestException(err);
    }
  }
}
