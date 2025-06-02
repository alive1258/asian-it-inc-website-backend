import { Module } from '@nestjs/common';
import { ServiceFaqIntroductionService } from './service-faq-introduction.service';
import { ServiceFaqIntroductionController } from './service-faq-introduction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceFaqIntroduction } from './entities/service-faq-introduction.entity';

@Module({
  controllers: [ServiceFaqIntroductionController],
  providers: [ServiceFaqIntroductionService],
  exports: [ServiceFaqIntroductionService],
  imports: [TypeOrmModule.forFeature([ServiceFaqIntroduction])],
})
export class ServiceFaqIntroductionModule {}
