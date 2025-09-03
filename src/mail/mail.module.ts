import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { LoggerMiddleware } from 'src/middleware/logger.middleware';

@Module({
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {
  configure(consumer : MiddlewareConsumer){
    consumer.apply(LoggerMiddleware).forRoutes(MailController)
  }
}
