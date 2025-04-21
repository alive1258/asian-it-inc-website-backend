import { Module } from '@nestjs/common';
import { FaqAnsService } from './faq-ans.service';
import { FaqAnsController } from './faq-ans.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { FaqAn } from './entities/faq-an.entity';

@Module({
  controllers: [FaqAnsController],
  providers: [FaqAnsService],
  imports: [TypeOrmModule.forFeature([FaqAn])],
  exports: [FaqAnsService],
})
export class FaqAnsModule {}
