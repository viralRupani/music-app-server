import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

@InputType()
export class ResetPasswordInput {
  @Field()
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  otp: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsStrongPassword({
    minLength: 8,
  })
  password: string;
}
