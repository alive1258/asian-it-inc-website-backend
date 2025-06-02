import { Module } from '@nestjs/common';
import { FaqService } from './faq.service';
import { FaqController } from './faq.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faq } from './entities/faq.entity';

@Module({
  controllers: [FaqController],
  providers: [FaqService],
  exports: [FaqService],
  imports: [TypeOrmModule.forFeature([Faq])],
})
export class FaqModule {}
