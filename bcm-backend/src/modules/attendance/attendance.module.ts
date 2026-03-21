import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { AttendanceRecord } from '../../database/models/attendance-record.model';
import { AttendanceSession } from '../../database/models/attendance-session.model';
import { Band } from '../../database/models/band.model';
import { BandMembership } from '../../database/models/band-membership.model';
import { Unit } from '../../database/models/unit.model';
import { UnitMembership } from '../../database/models/unit-membership.model';
import { ClassBatch } from '../../database/models/class-batch.model';
import { ClassEnrollment } from '../../database/models/class-enrollment.model';
import { Project } from '../../database/models/project.model';
import { ProjectMembership } from '../../database/models/project-membership.model';
import { Member } from '../../database/models/member.model';
import { User } from '../../database/models/user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      AttendanceSession,
      AttendanceRecord,
      Band,
      BandMembership,
      Unit,
      UnitMembership,
      ClassBatch,
      ClassEnrollment,
      Project,
      ProjectMembership,
      Member,
      User,
    ]),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
