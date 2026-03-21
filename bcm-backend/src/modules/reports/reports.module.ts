import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { ReportHistory } from '../../database/models/report-history.model';
import { Member } from '../../database/models/member.model';
import { Band } from '../../database/models/band.model';
import { Unit } from '../../database/models/unit.model';
import { LeadershipAssignment } from '../../database/models/leadership-assignment.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ReportHistory,
      Member,
      Band,
      Unit,
      LeadershipAssignment,
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
