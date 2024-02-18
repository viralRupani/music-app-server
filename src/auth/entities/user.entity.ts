import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Otp } from './otp.entity';

@Entity()
@ObjectType()
export class User {
  @PrimaryColumn()
  @Field()
  id: string;

  @Column()
  @Field()
  first_name: string;

  @Column()
  @Field()
  last_name: string;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column()
  @Field()
  phone_number: string;

  @Column()
  password: string;

  @OneToMany(() => Otp, (otp) => otp.user)
  otps?: Otp[];
}
