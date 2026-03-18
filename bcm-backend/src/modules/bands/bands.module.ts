import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BandsController } from './bands.controller';
import { BandsService } from './bands.service';
import { Band } from '../../database/models/band.model';
import { BandMembership } from '../../database/models/band-membership.model';
import { Member } from '../../database/models/member.model';
import { LeadershipAssignment } from '../../database/models/leadership-assignment.model';
import { LeadershipRoleTemplate } from '../../database/models/leadership-role-template.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Band,
      BandMembership,
      Member,
      LeadershipAssignment,
      LeadershipRoleTemplate,
    ]),
  ],
  controllers: [BandsController],
  providers: [BandsService],
  exports: [BandsService],
})
export class BandsModule {}
