import { Module } from '@nestjs/common';
import { FaqAnsService } from './faq-ans.service';
import { FaqAnsController } from './faq-ans.controller';

@Module({
  controllers: [FaqAnsController],
  providers: [FaqAnsService],
})
export class FaqAnsModule {}
