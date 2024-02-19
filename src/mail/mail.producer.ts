import { ISendMailOptions } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class MailProducer {
  constructor(@InjectQueue('e_mail') private emailQueue: Queue) {}

  async queueMail(options: ISendMailOptions) {
    try {
      await this.emailQueue.add('dequeueMail', options, {
        attempts: 3,
      });
      return 'ok';
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
