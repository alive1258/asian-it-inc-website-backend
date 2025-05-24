import { Module } from '@nestjs/common';
import { TeamMemberSkillsService } from './team-member-skills.service';
import { TeamMemberSkillsController } from './team-member-skills.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamMemberSkill } from './entities/team-member-skill.entity';

@Module({
  controllers: [TeamMemberSkillsController],
  providers: [TeamMemberSkillsService],
  imports: [TypeOrmModule.forFeature([TeamMemberSkill])],
  exports: [TeamMemberSkillsService],
})
export class TeamMemberSkillsModule {}
