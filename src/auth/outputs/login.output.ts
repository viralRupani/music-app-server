import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class LoginOutput {
  @Field(() => User)
  user: User;

  @Field()
  accessToken: string;
}
