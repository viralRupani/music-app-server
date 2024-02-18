import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { otpTypeEnum } from '../enums/otp-type.enum';
import { Field } from '@nestjs/graphql';
import { User } from './user.entity';

@Entity()
export class Otp {
  @PrimaryColumn()
  email: string;

  @PrimaryColumn()
  otp: string;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({
    type: 'enum',
    enum: otpTypeEnum,
  })
  @Field(() => otpTypeEnum)
  otp_type: otpTypeEnum;

  @ManyToOne(() => User, (user) => user.otps)
  @JoinColumn({
    name: 'email',
    referencedColumnName: 'email',
  })
  user: User;

  @Column({ default: true })
  is_active?: boolean;
}
