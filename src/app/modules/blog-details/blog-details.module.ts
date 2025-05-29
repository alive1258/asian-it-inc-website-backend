import { Module } from '@nestjs/common';
import { BlogDetailsService } from './blog-details.service';
import { BlogDetailsController } from './blog-details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogDetail } from './entities/blog-detail.entity';

@Module({
  controllers: [BlogDetailsController],
  providers: [BlogDetailsService],
  imports: [TypeOrmModule.forFeature([BlogDetail])],
  exports: [BlogDetailsService],
})
export class BlogDetailsModule {}
