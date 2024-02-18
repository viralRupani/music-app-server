import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Messages } from 'src/common/constants';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
    super();
  }

  async validate(username: string, password: string) {
    try {
      const foundUser: User = await this.usersRepository.findOneOrFail({
        where: {
          email: username,
        },
      });

      if (await bcrypt.compare(password, foundUser.password)) {
        const { password, ...rest } = foundUser;
        return rest;
      }

      throw new UnauthorizedException(Messages.WRONG_CREDENTIALS);
    } catch (err) {
      throw new UnauthorizedException(Messages.WRONG_CREDENTIALS);
    }
  }
}
