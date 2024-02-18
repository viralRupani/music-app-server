import { Field, InputType } from '@nestjs/graphql';
import { IsStrongPassword } from 'class-validator';

@InputType()
export class ChangePasswordInput {
  @Field()
  oldPassword: string;

  @Field()
  @IsStrongPassword({
    minLength: 8,
  })
  newPassword: string;
}
