import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { ReportHistory } from '../../database/models/report-history.model';
import { Member } from '../../database/models/member.model';
import { Band } from '../../database/models/band.model';
import { Unit } from '../../database/models/unit.model';
import { LeadershipAssignment } from '../../database/models/leadership-assignment.model';
import { AttendanceRecord } from '../../database/models/attendance-record.model';
import { AttendanceSession } from '../../database/models/attendance-session.model';
@Module({
  imports: [
    SequelizeModule.forFeature([
      ReportHistory,
      Member,
      Band,
      Unit,
      LeadershipAssignment,
      AttendanceRecord,
      AttendanceSession,
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
