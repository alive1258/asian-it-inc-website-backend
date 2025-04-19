import { Module } from '@nestjs/common';
import { FaqsService } from './faqs.service';
import { FaqsController } from './faqs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faq } from './entities/faq.entity';

@Module({
  controllers: [FaqsController],
  providers: [FaqsService],
  imports: [TypeOrmModule.forFeature([Faq])],
  exports: [FaqsService],
})
export class FaqsModule {}
