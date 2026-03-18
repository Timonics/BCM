import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LeadershipRoleTemplate } from '../../database/models/leadership-role-template.model';
import { LeadershipAssignment } from '../../database/models/leadership-assignment.model';
import { Member } from '../../database/models/member.model';
import { Band } from '../../database/models/band.model';
import { Unit } from '../../database/models/unit.model';
import { ClassBatch } from '../../database/models/class-batch.model';
import { Department } from '../../database/models/department.model';
import { Project } from '../../database/models/project.model';
import { LeadershipController } from './leadership.controller';
import { LeadershipService } from './leadership.service';

/**
 * Leadership Module
 * Handles leadership role templates and assignments
 * - Role template CRUD
 * - Leadership assignment management
 * - Tenure tracking and expiry notifications
 * - Supports SIC, Band, Unit, Class, Committee, and Department leadership
 */
@Module({
  imports: [
    SequelizeModule.forFeature([
      LeadershipRoleTemplate,
      LeadershipAssignment,
      Member,
      Band,
      Unit,
      ClassBatch,
      Department,
      Project,
    ]),
  ],
  controllers: [LeadershipController],
  providers: [LeadershipService],
  exports: [LeadershipService],
})
export class LeadershipModule {}
