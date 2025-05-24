import { Module } from '@nestjs/common';
import { TeamMemberSocialLinksService } from './team-member-social-links.service';
import { TeamMemberSocialLinksController } from './team-member-social-links.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamMemberSocialLink } from './entities/team-member-social-link.entity';

@Module({
  controllers: [TeamMemberSocialLinksController],
  providers: [TeamMemberSocialLinksService],
  imports: [TypeOrmModule.forFeature([TeamMemberSocialLink])],
  exports: [TeamMemberSocialLinksService],
})
export class TeamMemberSocialLinksModule {}
