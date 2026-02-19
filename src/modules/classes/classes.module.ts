import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClassType } from '../../database/models/class-type.model';
import { ClassBatch } from '../../database/models/class-batch.model';
import { ClassEnrollment } from '../../database/models/class-enrollment.model';
import { Member } from '../../database/models/member.model';
import { LeadershipAssignment } from '../../database/models/leadership-assignment.model';
import { LeadershipRoleTemplate } from '../../database/models/leadership-role-template.model';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';

/**
 * Classes Module
 * Handles class batch management for:
 * - Pre-Youth: Annual batches
 * - Baptismal & ETS: Biannual batches (January & August)
 * - Batch creation, enrollment, approval workflow
 * - Coordinator approval for completions
 * - Leadership management
 */
@Module({
  imports: [
    SequelizeModule.forFeature([
      ClassType,
      ClassBatch,
      ClassEnrollment,
      Member,
      LeadershipAssignment,
      LeadershipRoleTemplate,
    ]),
  ],
  controllers: [ClassesController],
  providers: [ClassesService],
  exports: [ClassesService],
})
export class ClassesModule {}
