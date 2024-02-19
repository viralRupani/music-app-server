import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { InternalServerErrorException } from '@nestjs/common';
import { Job } from 'bull';

@Processor('e_mail')
export class MailConsumer {
  constructor(private readonly mailerService: MailerService) {}

  @Process('dequeueMail')
  async sendEmail(job: Job) {
    try {
      await this.mailerService.sendMail(job.data as ISendMailOptions);
      return {};
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
