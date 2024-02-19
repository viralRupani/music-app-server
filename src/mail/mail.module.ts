import { Module } from '@nestjs/common';
import { MailProducer } from './mail.producer';
import { BullModule } from '@nestjs/bull';
import { MailConsumer } from './mail.consumer';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'e_mail',
      redis: {
        port: 6379,
      },
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mailConfig = configService.get('mailConfig');
        console.log(mailConfig);
        return {
          transport: {
            from: mailConfig.user,
            host: mailConfig.host,
            port: mailConfig.port,
            tls: mailConfig.requireTLS,
            auth: {
              user: mailConfig.user,
              pass: mailConfig.pass,
            },
          },
          template: {
            dir: `${__dirname}/../mail/templates`,
            adapter: new EjsAdapter(),
          },
        };
      },
    }),
  ],
  providers: [MailProducer, MailConsumer],
  exports: [MailProducer],
})
export class MailModule {}
