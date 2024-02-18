import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsPhoneNumber, IsStrongPassword } from 'class-validator';

@InputType()
export class RegisterInput {
  @Field()
  id: string;

  @Field()
  first_name: string;

  @Field()
  last_name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsPhoneNumber('IN')
  phone_number: string;

  @Field()
  @IsStrongPassword({
    minLength: 8,
  })
  password: string;
}
