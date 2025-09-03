import { Injectable, InternalServerErrorException } from '@nestjs/common';
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import { join } from 'path';
import { existsSync } from 'fs';
import { CreateMailDto } from './dto/create-mail.dto';
import { MAIL_CONSTANTS } from '../constants/mail.constants';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: MAIL_CONSTANTS.SERVICE,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Resolve templates path dynamically for dev and production
    const templatesDir = existsSync(join(__dirname, 'templates'))
      ? join(__dirname, 'templates') // dev mode
      : join(process.cwd(), 'dist/mail/templates'); // production after build

    this.transporter.use(
      'compile',
      hbs({
        viewEngine: {
          extName: '.hbs',
          partialsDir: templatesDir,
          defaultLayout: false,
        },
        viewPath: templatesDir,
        extName: '.hbs',
      }),
    );
  }

  async sendMail(createMailDto: CreateMailDto & { template?: string; context?: any }) {
    try {
      const { to, subject, text, attachments, template, context } = createMailDto;

      const mailOptions: any = {
        from: MAIL_CONSTANTS.FROM,
        to,
        subject,
        text,
        attachments,
        template,
        context,
      };

      const result = await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        messageId: result.messageId,
        response: result.response,
      };
    } catch (error) {
      throw new InternalServerErrorException(`Mail sending failed: ${error.message}`);
    }
  }
}
