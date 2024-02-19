import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterInput } from './inputs/register.input';
import { LoginInput } from './inputs/login.input';
import { User } from './entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { LoginOutput } from './outputs/login.output';
import { GqlThrottlerGuard } from 'src/common/guards/gql-throttler.guard';
import { ChangePasswordInput } from './inputs/change-password.input';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ForgotPasswordInput } from './inputs/forgot-password.input';
import { ResetPasswordInput } from './inputs/reset-password.input';
import { MailProducer } from 'src/mail/mail.producer';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly mailProducer: MailProducer,
  ) {}

  @Query(() => LoginOutput)
  @UseGuards(LocalAuthGuard)
  @UseGuards(GqlThrottlerGuard)
  async login(
    @Args('loginInput') loginInput: LoginInput,
    @CurrentUser() user: User,
  ) {
    const accessToken: string = this.authService.getJwt(user);
    return {
      user,
      accessToken,
    };
  }

  @Mutation(() => User)
  async register(
    @Args('registerInput') registerInput: RegisterInput,
  ): Promise<User> {
    return await this.authService.register(registerInput);
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Args('changePasswordInput') changePasswordInput: ChangePasswordInput,
    @CurrentUser() user: User,
  ): Promise<string> {
    return await this.authService.changePassword(changePasswordInput, user);
  }

  @Mutation(() => String)
  async forgotPassword(
    @Args('objet') forgotPasswordInput: ForgotPasswordInput,
  ) {
    const otp: string =
      await this.authService.forgotPassword(forgotPasswordInput);

    await this.mailProducer.queueMail({
      subject: '[Music App]: Forgot Password OTP',
      to: forgotPasswordInput.email,
      template: 'forgot-password',
      context: { otp },
    });

    return 'An Email has been sent to you for reset password.';
  }

  @Mutation(() => String)
  async resetPassword(@Args('object') resetPassInput: ResetPasswordInput) {
    return await this.authService.resetPassword(resetPassInput);
  }
}
