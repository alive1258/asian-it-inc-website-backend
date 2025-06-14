import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolio } from './entities/portfolio.entity';

@Module({
  controllers: [PortfolioController],
  providers: [PortfolioService],
  exports: [PortfolioService],
  imports: [TypeOrmModule.forFeature([Portfolio])],
})
export class PortfolioModule {}
