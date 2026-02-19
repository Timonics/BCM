import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Unit } from '../../database/models/unit.model';
import { UnitMembership } from '../../database/models/unit-membership.model';
import { Member } from '../../database/models/member.model';
import { LeadershipAssignment } from '../../database/models/leadership-assignment.model';
import { LeadershipRoleTemplate } from '../../database/models/leadership-role-template.model';
import { UnitsController } from './units.controller';
import { UnitsService } from './units.service';

/**
 * Units Module
 * Handles unit management, member assignments, and leadership assignments
 */
@Module({
  imports: [
    SequelizeModule.forFeature([
      Unit,
      UnitMembership,
      Member,
      LeadershipAssignment,
      LeadershipRoleTemplate,
    ]),
  ],
  controllers: [UnitsController],
  providers: [UnitsService],
  exports: [UnitsService],
})
export class UnitsModule {}
