import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Department } from '../../database/models/department.model';
import { Unit } from '../../database/models/unit.model';
import { UnitMembership } from '../../database/models/unit-membership.model';
import { Member } from '../../database/models/member.model';
import { LeadershipAssignment } from '../../database/models/leadership-assignment.model';
import { LeadershipRoleTemplate } from '../../database/models/leadership-role-template.model';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';

/**
 * Departments Module
 * Handles department CRUD, overview/detail, units, members, leadership, add member, add unit
 */
@Module({
  imports: [
    SequelizeModule.forFeature([
      Department,
      Unit,
      UnitMembership,
      Member,
      LeadershipAssignment,
      LeadershipRoleTemplate,
    ]),
  ],
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
  exports: [DepartmentsService],
})
export class DepartmentsModule {}
