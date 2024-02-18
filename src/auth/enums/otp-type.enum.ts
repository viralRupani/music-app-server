import { registerEnumType } from '@nestjs/graphql';

export enum otpTypeEnum {
  forgotPassword = 'Forgot Password',
}

registerEnumType(otpTypeEnum, {
  name: 'otpTypeEnum',
});
