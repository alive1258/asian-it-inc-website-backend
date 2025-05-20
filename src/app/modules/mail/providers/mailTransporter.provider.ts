import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';

@Injectable()
export class MailTransporter {
  constructor(
    /**
     * Inject MailerService
     */

    private readonly configService: ConfigService,
  ) {}

  public async createTransporter(): Promise<Transporter> {
    return createTransport({
      host: this.configService.get('appConfig.mailHost'),
      port: this.configService.get('appConfig.mailPort'),
      secure: this.configService.get('appConfig.secure'),
      auth: {
        user: this.configService.get('appConfig.smtpUserName'),
        pass: this.configService.get('appConfig.smtpPassword'),
      },
      tls: {
        // Add this to allow self-signed certificates
        rejectUnauthorized: false,
      },
    });
  }
  // public async sendMail(options: SendMailOptions) {
  //   return this.transporter.sendMail(options);
  // }
}

// src/mail/providers/mailTransporter.provider.ts
// import { Injectable } from '@nestjs/common';
// import * as nodemailer from 'nodemailer';
// import { SendMailOptions } from 'nodemailer';

// @Injectable()
// export class MailTransporter {
//   private transporter = nodemailer.createTransport({
//     host: process.env.MAIL_HOST,
//     port: parseInt(process.env.MAIL_PORT ?? '2525', 10),
//     secure: process.env.MAIL_SECURE === 'true',
//     auth: {
//       user: process.env.SMTP_USERNAME,
//       pass: process.env.SMTP_PASSWORD,
//     },
//   });

//   public async sendMail(options: SendMailOptions) {
//     return this.transporter.sendMail(options);
//   }
// }
