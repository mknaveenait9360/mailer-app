import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  @UseInterceptors(
    FileInterceptor('attachments', {
      storage: diskStorage({
        destination: './uploads', 
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async send(@Body() body: any, @UploadedFile() file: any) { 
    try {

      const mailDto = {
  to: body.to,
  subject: body.subject,
  attachments: file ? [{ filename: file.originalname, path: `./uploads/${file.filename}` }] : [],
  template: body.template,  // pass template name from Postman
  context: body.context ? JSON.parse(body.context) : {}, // pass JSON string for template variables
};

      if (!mailDto.to || !mailDto.subject) {
        throw new BadRequestException('to and subject are required fields');
      }

      return await this.mailService.sendMail(mailDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
