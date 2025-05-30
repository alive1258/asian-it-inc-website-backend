import { Module } from '@nestjs/common';
import { AboutUsController } from './about-us.controller';
import { AboutUsService } from './about-us.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AboutUs } from './entities/about-us.entity';

@Module({
  controllers: [AboutUsController],
  providers: [AboutUsService],
  imports: [TypeOrmModule.forFeature([AboutUs])],
})
export class AboutUsModule {


}
