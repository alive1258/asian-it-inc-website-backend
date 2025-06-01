import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';
import { SmtpConfig } from '../../smtp/entities/smtp-config.entity';

@Injectable()
export class MailTransporter {
  constructor(
    /**
     * Inject MailerService
     */

    private readonly configService: ConfigService,
  ) {}

  public async createTransporter(
    emailConfig: SmtpConfig,
  ): Promise<Transporter> {
    return createTransport({
      host: emailConfig.mail_host,
      port: emailConfig.mail_port,
      secure: emailConfig.mail_encryption,
      auth: {
        user: emailConfig.mail_username,
        pass: emailConfig.mail_password,
      },
      tls: {
        // Add this to allow self-signed certificates
        rejectUnauthorized: false,
      },
    });
  }
}
