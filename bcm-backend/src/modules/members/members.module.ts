import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { Member } from '../../database/models/member.model';
import { BandMembership } from '../../database/models/band-membership.model';
import { UnitMembership } from '../../database/models/unit-membership.model';
import { Band } from '../../database/models/band.model';
import { Unit } from '../../database/models/unit.model';
import { ClassEnrollment } from '../../database/models/class-enrollment.model';
import { ClassType } from '../../database/models/class-type.model';
import { ClassBatch } from '../../database/models/class-batch.model';
import { MemberAcademic } from '../../database/models/member-academic.model';
import { MemberEmployment } from '../../database/models/member-employment.model';

/**
 * Members Module
 * Provides member management functionality
 */
@Module({
  imports: [
    SequelizeModule.forFeature([
      Member,
      BandMembership,
      UnitMembership,
      Band,
      Unit,
      ClassEnrollment,
      ClassType,
      ClassBatch,
      MemberAcademic,
      MemberEmployment,
    ]),
  ],
  controllers: [MembersController],
  providers: [MembersService],
  exports: [MembersService],
})
export class MembersModule {}
