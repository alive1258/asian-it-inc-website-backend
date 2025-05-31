import { Module } from '@nestjs/common';
import { WhyChooseUsController } from './why-choose-us.controller';
import { WhyChooseUsService } from './why-choose-us.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhyChoose } from './entities/why-choose-us.entity';

@Module({
  controllers: [WhyChooseUsController],
  providers: [WhyChooseUsService],
  imports: [TypeOrmModule.forFeature([WhyChoose])],
})
export class WhyChooseUsModule { }
