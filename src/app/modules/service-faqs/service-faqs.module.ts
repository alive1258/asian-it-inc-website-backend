import { Module } from '@nestjs/common';
import { ServiceFaqsService } from './service-faqs.service';
import { ServiceFaqsController } from './service-faqs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceFaq } from './entities/service-faq.entity';

@Module({
  controllers: [ServiceFaqsController],
  providers: [ServiceFaqsService],
  exports: [ServiceFaqsService],
  imports: [TypeOrmModule.forFeature([ServiceFaq])],
})
export class ServiceFaqsModule {}
