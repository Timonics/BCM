import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Member } from '../database/models/member.model';
import { Band } from '../database/models/band.model';
import { Unit } from '../database/models/unit.model';
import { ClassBatch } from '../database/models/class-batch.model';
import { BandMembership } from '../database/models/band-membership.model';
import { LeadershipAssignment } from '../database/models/leadership-assignment.model';

/**
 * Dashboard Module
 * TODO: Implement dashboard overview and statistics
 * - Total members, bands, units, classes
 * - Alerts: Over-age members, expired leadership, pending class completions
 */
@Module({
  imports: [
    SequelizeModule.forFeature([
      Member,
      Band,
      Unit,
      ClassBatch,
      BandMembership,
      LeadershipAssignment,
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class DashboardModule {}
