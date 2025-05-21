import { Module } from '@nestjs/common';
import { SocialSitesService } from './social-sites.service';
import { SocialSitesController } from './social-sites.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialSite } from './entities/social-site.entity';

@Module({
  controllers: [SocialSitesController],
  providers: [SocialSitesService],
  imports: [TypeOrmModule.forFeature([SocialSite])],
  exports: [SocialSitesService],
})
export class SocialSitesModule {}
