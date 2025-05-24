import { Module } from '@nestjs/common';
import { TeamMembersService } from './team-members.service';
import { TeamMembersController } from './team-members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamMember } from './entities/team-member.entity';
import { TeamMemberSkillsModule } from '../team-member-skills/team-member-skills.module';

import { TeamMemberSocialLinksModule } from '../team-member-social-links/team-member-social-links.module';

@Module({
  controllers: [TeamMembersController],
  providers: [TeamMembersService],

  imports: [
    TypeOrmModule.forFeature([TeamMember]),
    TeamMemberSkillsModule,
    TeamMemberSocialLinksModule,
  ],
  exports: [TeamMembersService],
})
export class TeamMembersModule {}
