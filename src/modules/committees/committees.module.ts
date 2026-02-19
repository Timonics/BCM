import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from '../../database/models/project.model';
import { ProjectMembership } from '../../database/models/project-membership.model';
import { LeadershipAssignment } from '../../database/models/leadership-assignment.model';
import { LeadershipRoleTemplate } from '../../database/models/leadership-role-template.model';
import { Member } from '../../database/models/member.model';
import { Band } from '../../database/models/band.model';
import { BandMembership } from '../../database/models/band-membership.model';
import { Unit } from '../../database/models/unit.model';
import { UnitMembership } from '../../database/models/unit-membership.model';
import { CommitteesController } from './committees.controller';
import { CommitteesService } from './committees.service';

/**
 * Committees Module
 * Plain membership: ProjectMembership. Leadership: Leadership module (scopeEntity PROJECT).
 */
@Module({
  imports: [
    SequelizeModule.forFeature([
      Project,
      ProjectMembership,
      LeadershipAssignment,
      LeadershipRoleTemplate,
      Member,
      Band,
      BandMembership,
      Unit,
      UnitMembership,
    ]),
  ],
  controllers: [CommitteesController],
  providers: [CommitteesService],
  exports: [CommitteesService],
})
export class CommitteesModule {}
