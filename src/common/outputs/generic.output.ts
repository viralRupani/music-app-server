import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GenericOutput {
  @Field()
  data: object;
}
