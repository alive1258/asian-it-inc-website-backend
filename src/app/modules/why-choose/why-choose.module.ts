import { Module } from '@nestjs/common';
import { WhyChooseService } from './why-choose.service';
import { WhyChooseController } from './why-choose.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhyChoose } from './entities/why-choose.entity';

@Module({
  controllers: [WhyChooseController],
  providers: [WhyChooseService],
  exports: [WhyChooseService],
  imports: [TypeOrmModule.forFeature([WhyChoose])],
})
export class WhyChooseModule {}
