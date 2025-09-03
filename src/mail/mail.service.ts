import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { CreateMailDto } from './dto/create-mail.dto';
import { MAIL_CONSTANTS } from 'src/constants/mail.constants';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const options: SMTPTransport.Options = {
      service: MAIL_CONSTANTS.SERVICE,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, 
      },
    };

    this.transporter = nodemailer.createTransport(options);
  }

  async sendMail(createMailDto: CreateMailDto) {
    try {
      const { to, subject, text, attachments } = createMailDto;

      const mailOptions: nodemailer.SendMailOptions = {
        from: MAIL_CONSTANTS.FROM,
        to,
        subject,
        text,
        attachments,
      };

      const result = await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        messageId: result.messageId,
        response: result.response,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Mail sending failed: ${error.message}`,
      );
    }
  }
}
