import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ClassType } from '../../database/models/class-type.model';
import { ClassBatch } from '../../database/models/class-batch.model';
import { ClassEnrollment } from '../../database/models/class-enrollment.model';
import { Member } from '../../database/models/member.model';
import { LeadershipAssignment } from '../../database/models/leadership-assignment.model';
import { LeadershipRoleTemplate } from '../../database/models/leadership-role-template.model';
import { CreateClassBatchDto } from './dto/create-class-batch.dto';
import { UpdateClassBatchDto } from './dto/update-class-batch.dto';
import { AddClassMemberDto } from './dto/add-class-member.dto';
import { AssignClassLeadershipDto } from './dto/assign-class-leadership.dto';
import { ApproveEnrollmentDto } from './dto/approve-enrollment.dto';
import { UpdateEnrollmentStatusDto } from './dto/update-enrollment-status.dto';
import { ClassOverviewResponseDto } from './dto/class-overview-response.dto';
import { ClassBatchOverviewDto } from './dto/class-batch-overview.dto';
import { ClassBatchDetailDto } from './dto/class-batch-detail.dto';
import { ClassBatchLeadershipDto } from './dto/class-batch-leadership.dto';
import { ClassBatchMemberDto } from './dto/class-batch-member.dto';
import { GraduationReadinessDto } from './dto/graduation-readiness.dto';

/**
 * Classes Service
 * Handles class batch management for Pre-Youth, Baptismal, and ETS classes
 * - Pre-Youth: Annual batches
 * - Baptismal & ETS: Biannual batches (January and August)
 */
@Injectable()
export class ClassesService {
  constructor(
    @InjectModel(ClassType)
    private classTypeModel: typeof ClassType,
    @InjectModel(ClassBatch)
    private classBatchModel: typeof ClassBatch,
    @InjectModel(ClassEnrollment)
    private classEnrollmentModel: typeof ClassEnrollment,
    @InjectModel(Member)
    private memberModel: typeof Member,
    @InjectModel(LeadershipAssignment)
    private leadershipAssignmentModel: typeof LeadershipAssignment,
    @InjectModel(LeadershipRoleTemplate)
    private leadershipRoleTemplateModel: typeof LeadershipRoleTemplate,
  ) {}

  /**
   * Get class overview statistics by class type
   */
  async getClassOverview(
    classTypeCode: string,
  ): Promise<ClassOverviewResponseDto> {
    const classType = await this.classTypeModel.findOne({
      where: { code: classTypeCode },
    });

    if (!classType) {
      throw new NotFoundException(`Class type ${classTypeCode} not found`);
    }

    const activeBatches = await this.classBatchModel.count({
      where: {
        classTypeId: classType.id,
        status: { [Op.in]: ['open', 'started'] },
      },
    });

    const membersInClasses = await this.classEnrollmentModel.count({
      where: {
        enrollmentStatus: { [Op.in]: ['enrolled', 'approved'] },
      },
      include: [
        {
          model: ClassBatch,
          where: { classTypeId: classType.id },
        },
      ],
    });

    const readyForGraduation = await this.classEnrollmentModel.count({
      where: {
        graduationStatus: 'ready',
        enrollmentStatus: { [Op.in]: ['enrolled', 'approved'] },
      },
      include: [
        {
          model: ClassBatch,
          where: { classTypeId: classType.id },
        },
      ],
    });

    const pendingApprovals = await this.classEnrollmentModel.count({
      where: {
        enrollmentStatus: 'enrolled',
      },
      include: [
        {
          model: ClassBatch,
          where: { classTypeId: classType.id },
        },
      ],
    });

    return {
      activeBatches,
      membersInClasses,
      readyForGraduation,
      pendingApprovals,
    };
  }

  /**
   * Get all class batches by class type with overview information
   */
  async getAllClassBatches(
    classTypeCode: string,
    search?: string,
    status?: string,
    year?: number,
  ): Promise<ClassBatchOverviewDto[]> {
    const classType = await this.classTypeModel.findOne({
      where: { code: classTypeCode },
    });

    if (!classType) {
      throw new NotFoundException(`Class type ${classTypeCode} not found`);
    }

    const where: any = { classTypeId: classType.id };

    if (search) {
      where[Op.or] = [
        { batchCode: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (year) {
      where.year = year;
    }

    const batches = await this.classBatchModel.findAll({
      where,
      include: [{ model: ClassType }],
      order: [
        ['year', 'DESC'],
        ['startDate', 'DESC'],
      ],
    });

    const batchesWithOverview = await Promise.all(
      batches.map(async (batch) => {
        const enrollments = await this.classEnrollmentModel.findAll({
          where: { batchId: batch.id },
          include: [{ model: Member }],
        });

        const membersEnrolled = enrollments.length;

        // Calculate completion progress
        const totalSessions = enrollments.reduce(
          (sum, e) => sum + (e.totalSessions || 0),
          0,
        );
        const sessionsAttended = enrollments.reduce(
          (sum, e) => sum + (e.sessionsAttended || 0),
          0,
        );
        const completionProgress =
          totalSessions > 0
            ? Math.round((sessionsAttended / totalSessions) * 100)
            : 0;

        // Calculate average attendance
        const attendancePercentages = enrollments
          .filter((e) => e.totalSessions && e.totalSessions > 0)
          .map((e) => Math.round((e.sessionsAttended / e.totalSessions) * 100));
        const averageAttendance =
          attendancePercentages.length > 0
            ? Math.round(
                attendancePercentages.reduce((a, b) => a + b, 0) /
                  attendancePercentages.length,
              )
            : 0;

        // Get coordinator
        const coordinatorRole = await this.leadershipRoleTemplateModel.findOne({
          where: {
            name: { [Op.iLike]: '%coordinator%' },
            category: 'CLASS',
          },
        });

        let coordinatorName: string | undefined;
        if (coordinatorRole) {
          const coordinatorAssignment =
            await this.leadershipAssignmentModel.findOne({
              where: {
                templateId: coordinatorRole.id,
                scopeEntity: 'CLASS_BATCH',
                scopeId: batch.id,
                leadershipStatus: 'active',
              },
              include: [{ model: Member }],
            });

          if (coordinatorAssignment?.member) {
            const member = coordinatorAssignment.member;
            coordinatorName = [
              member.firstName,
              member.middleName,
              member.surname,
            ]
              .filter(Boolean)
              .join(' ');
          }
        }

        // Calculate readiness status based on completion progress
        let readinessStatus: string;
        if (completionProgress >= 80) {
          readinessStatus = 'high';
        } else if (completionProgress >= 50) {
          readinessStatus = 'medium';
        } else {
          readinessStatus = 'low';
        }

        // Get ready for graduation count
        const readyForGraduation = enrollments.filter(
          (e) => e.graduationStatus === 'ready',
        ).length;

        // Get leadership count
        const leadershipCount = await this.leadershipAssignmentModel.count({
          where: {
            scopeEntity: 'CLASS_BATCH',
            scopeId: batch.id,
            leadershipStatus: 'active',
          },
        });

        // Get pending approvals (for Baptismal and ETS)
        const pendingApprovals = enrollments.filter(
          (e) => e.enrollmentStatus === 'enrolled',
        ).length;

        // Get band eligible (for ETS)
        const bandEligible =
          classTypeCode === 'ETS'
            ? enrollments.filter((e) => e.bandEligible).length
            : undefined;

        // Get total graduated
        const totalGraduated = enrollments.filter(
          (e) =>
            e.enrollmentStatus === 'approved' && e.graduationStatus === 'ready',
        ).length;

        return {
          id: batch.id,
          batchCode: batch.batchCode,
          classType: classType.code,
          status: batch.status,
          year: batch.year,
          intake: batch.intake,
          startDate: batch.startDate,
          endDate: batch.endDate,
          membersEnrolled,
          maxCapacity: batch.maxCapacity || 0,
          completionProgress,
          readinessStatus,
          coordinatorName,
          averageAttendance,
          leadershipCount,
          readyForGraduation,
          totalGraduated,
          pendingApprovals,
          bandEligible,
        };
      }),
    );

    return batchesWithOverview;
  }

  /**
   * Get class batch details by ID
   */
  async getClassBatchDetails(
    batchId: string,
    includeMembers: boolean = true,
  ): Promise<ClassBatchDetailDto> {
    const batch = await this.classBatchModel.findByPk(batchId, {
      include: [{ model: ClassType }],
    });

    if (!batch) {
      throw new NotFoundException(`Class batch with ID ${batchId} not found`);
    }

    const enrollments = await this.classEnrollmentModel.findAll({
      where: { batchId: batch.id },
      include: [{ model: Member }],
    });

    const totalMembers = enrollments.length;
    const activeMembers = enrollments.filter(
      (e) =>
        e.enrollmentStatus === 'enrolled' || e.enrollmentStatus === 'approved',
    ).length;

    // Calculate gender distribution
    const genderDistribution = {
      male: enrollments.filter((e) => e.member?.gender === 'male').length,
      female: enrollments.filter((e) => e.member?.gender === 'female').length,
    };

    // Calculate average attendance
    const attendancePercentages = enrollments
      .filter((e) => e.totalSessions && e.totalSessions > 0)
      .map((e) => Math.round((e.sessionsAttended / e.totalSessions) * 100));
    const averageAttendance =
      attendancePercentages.length > 0
        ? Math.round(
            attendancePercentages.reduce((a, b) => a + b, 0) /
              attendancePercentages.length,
          )
        : 0;

    // Calculate completion progress
    const totalSessions = enrollments.reduce(
      (sum, e) => sum + (e.totalSessions || 0),
      0,
    );
    const sessionsAttended = enrollments.reduce(
      (sum, e) => sum + (e.sessionsAttended || 0),
      0,
    );
    const completionProgress =
      totalSessions > 0
        ? Math.round((sessionsAttended / totalSessions) * 100)
        : 0;

    // Get leadership
    const leadership = await this.getBatchLeadership(batch.id);

    // Get graduation readiness
    const readyForGraduation = enrollments.filter(
      (e) => e.graduationStatus === 'ready',
    ).length;
    const notReady = enrollments.filter(
      (e) => e.graduationStatus === 'not_ready',
    ).length;
    const completionRate =
      totalMembers > 0
        ? Math.round((readyForGraduation / totalMembers) * 100)
        : 0;

    let readinessStatus: string;
    if (completionRate >= 80) {
      readinessStatus = 'high';
    } else if (completionRate >= 50) {
      readinessStatus = 'medium';
    } else {
      readinessStatus = 'low';
    }

    const graduationReadiness: GraduationReadinessDto = {
      ready: readyForGraduation,
      notReady,
      completionRate,
      readinessStatus,
    };

    // Get members list if requested
    let members: ClassBatchMemberDto[] | undefined;
    if (includeMembers) {
      members = enrollments.map((enrollment) => {
        const member = enrollment.member;
        const name = [member.firstName, member.middleName, member.surname]
          .filter(Boolean)
          .join(' ');

        let age: number | undefined;
        if (member.dob) {
          age = this.calculateAge(member.dob);
        }

        const attendanceStr = enrollment.totalSessions
          ? `${enrollment.sessionsAttended}/${enrollment.totalSessions}`
          : '0/0';
        const attendancePercentage = enrollment.totalSessions
          ? Math.round(
              (enrollment.sessionsAttended / enrollment.totalSessions) * 100,
            )
          : 0;

        // Determine enrollment source
        let enrollmentSource: string | undefined;
        if (enrollment.source === 'auto_migrate') {
          enrollmentSource = 'Pre-Youth';
        } else if (enrollment.source === 'import') {
          enrollmentSource = 'Import';
        } else {
          enrollmentSource = 'Manual';
        }

        return {
          id: enrollment.id,
          memberId: member.id,
          name: name || 'Unknown',
          gender: member.gender,
          age,
          enrolledAt: enrollment.enrolledAt,
          enrollmentSource,
          attendance: attendanceStr,
          attendancePercentage,
          enrollmentStatus: enrollment.enrollmentStatus,
          graduationStatus: enrollment.graduationStatus,
          attemptNo: enrollment.attemptNo,
          bandEligible: enrollment.bandEligible,
        };
      });
    }

    // Get pending approvals and approved counts (for Baptismal and ETS)
    const pendingApprovals = enrollments.filter(
      (e) => e.enrollmentStatus === 'enrolled',
    ).length;
    const approved = enrollments.filter(
      (e) => e.enrollmentStatus === 'approved',
    ).length;

    // Get band eligible (for ETS)
    const bandEligible =
      batch.classType.code === 'ETS'
        ? enrollments.filter((e) => e.bandEligible).length
        : undefined;

    // Get total graduated
    const totalGraduated = enrollments.filter(
      (e) =>
        e.enrollmentStatus === 'approved' && e.graduationStatus === 'ready',
    ).length;

    return {
      id: batch.id,
      batchCode: batch.batchCode,
      classType: batch.classType.code,
      classTypeName: batch.classType.name,
      status: batch.status,
      year: batch.year,
      intake: batch.intake,
      startDate: batch.startDate,
      endDate: batch.endDate,
      description: batch.description,
      totalMembers,
      activeMembers,
      readyForGraduation,
      genderDistribution,
      averageAttendance,
      completionProgress,
      leadership,
      graduationReadiness,
      members,
      pendingApprovals,
      approved,
      bandEligible,
      totalGraduated,
    };
  }

  /**
   * Create a new class batch
   */
  async createClassBatch(createDto: CreateClassBatchDto): Promise<ClassBatch> {
    if (!createDto.classTypeCode) {
      throw new BadRequestException('Class type code is required');
    }

    // Validate classTypeCode is one of the valid values
    const validClassTypes = ['PREYOUTH', 'BAPTISMAL', 'ETS'];
    if (!validClassTypes.includes(createDto.classTypeCode)) {
      throw new BadRequestException(
        `Class type code must be one of: ${validClassTypes.join(', ')}. Received: ${createDto.classTypeCode}`,
      );
    }

    const classType = await this.classTypeModel.findOne({
      where: { code: createDto.classTypeCode },
    });

    if (!classType) {
      throw new NotFoundException(
        `Class type ${createDto.classTypeCode} not found`,
      );
    }

    // Validate intake for biannual classes
    if (classType.cadence === 'biannual') {
      if (!createDto.intake || !['JAN', 'AUG'].includes(createDto.intake)) {
        throw new BadRequestException(
          'Biannual classes (Baptismal and ETS) must have intake of JAN or AUG',
        );
      }
    } else if (classType.cadence === 'annual') {
      // Pre-Youth uses ANNUAL intake
      if (!createDto.intake) {
        createDto.intake = 'ANNUAL';
      }
    }

    // Generate batch code
    const batchCode = this.generateBatchCode(
      createDto.classTypeCode,
      createDto.year,
      createDto.intake || 'ANNUAL',
    );

    // Check if batch code already exists
    const existing = await this.classBatchModel.findOne({
      where: { batchCode },
    });

    if (existing) {
      throw new BadRequestException(
        `Batch with code ${batchCode} already exists`,
      );
    }

    // Set default dates if not provided
    let startDate = createDto.startDate
      ? new Date(createDto.startDate)
      : undefined;
    let endDate = createDto.endDate ? new Date(createDto.endDate) : undefined;

    if (!startDate && createDto.intake === 'JAN') {
      startDate = new Date(createDto.year, 0, 5); // January 5
    } else if (!startDate && createDto.intake === 'AUG') {
      startDate = new Date(createDto.year, 7, 1); // August 1
    } else if (!startDate && createDto.intake === 'ANNUAL') {
      startDate = new Date(createDto.year, 0, 5); // January 5
    }

    if (!endDate && createDto.intake === 'JAN') {
      endDate = new Date(createDto.year, 4, 31); // May 31
    } else if (!endDate && createDto.intake === 'AUG') {
      endDate = new Date(createDto.year, 11, 31); // December 31
    } else if (!endDate && createDto.intake === 'ANNUAL') {
      endDate = new Date(createDto.year, 10, 30); // November 30
    }

    return this.classBatchModel.create({
      classTypeId: classType.id,
      batchCode,
      year: createDto.year,
      intake: createDto.intake || 'ANNUAL',
      startDate,
      endDate,
      description: createDto.description,
      maxCapacity: createDto.maxCapacity,
      systemGenerated: createDto.systemGenerated || false,
      status: 'not_started',
    });
  }

  /**
   * Update class batch
   */
  async updateClassBatch(
    batchId: string,
    updateDto: UpdateClassBatchDto,
  ): Promise<ClassBatch> {
    const batch = await this.classBatchModel.findByPk(batchId);

    if (!batch) {
      throw new NotFoundException(`Class batch with ID ${batchId} not found`);
    }

    const updateData: any = { ...updateDto };

    if (updateData.startDate && typeof updateData.startDate === 'string') {
      updateData.startDate = new Date(updateData.startDate);
    }

    if (updateData.endDate && typeof updateData.endDate === 'string') {
      updateData.endDate = new Date(updateData.endDate);
    }

    await batch.update(updateData);
    return batch.reload();
  }

  /**
   * Delete class batch (only if not system-generated)
   */
  async deleteClassBatch(batchId: string): Promise<void> {
    const batch = await this.classBatchModel.findByPk(batchId);

    if (!batch) {
      throw new NotFoundException(`Class batch with ID ${batchId} not found`);
    }

    if (batch.systemGenerated) {
      throw new BadRequestException(
        'System-generated batches cannot be deleted',
      );
    }

    await batch.destroy();
  }

  /**
   * Add member to class batch
   */
  async addMemberToBatch(
    batchId: string,
    addMemberDto: AddClassMemberDto,
  ): Promise<ClassEnrollment> {
    const batch = await this.classBatchModel.findByPk(batchId);

    if (!batch) {
      throw new NotFoundException(`Class batch with ID ${batchId} not found`);
    }

    const member = await this.memberModel.findByPk(addMemberDto.memberId);

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    // Check if member is already enrolled
    const existing = await this.classEnrollmentModel.findOne({
      where: {
        batchId: batch.id,
        memberId: addMemberDto.memberId,
        enrollmentStatus: { [Op.in]: ['enrolled', 'approved'] },
      },
    });

    if (existing) {
      throw new BadRequestException('Member is already enrolled in this batch');
    }

    // Get highest attempt number for this member in this batch type
    const allBatches = await this.classBatchModel.findAll({
      where: { classTypeId: batch.classTypeId },
    });
    const batchIds = allBatches.map((b) => b.id);

    const previousEnrollments = await this.classEnrollmentModel.findAll({
      where: {
        memberId: addMemberDto.memberId,
        batchId: { [Op.in]: batchIds },
      },
      order: [['attemptNo', 'DESC']],
    });

    const attemptNo =
      previousEnrollments.length > 0 ? previousEnrollments[0].attemptNo + 1 : 1;

    return this.classEnrollmentModel.create({
      batchId: batch.id,
      memberId: addMemberDto.memberId,
      attemptNo,
      enrollmentStatus: 'enrolled',
      source: addMemberDto.source || 'manual',
      enrolledAt: new Date(),
      sessionsAttended: 0,
      graduationStatus: 'not_ready',
      bandEligible: false,
    });
  }

  /**
   * Approve or fail enrollments
   */
  async approveEnrollments(
    batchId: string,
    approveDto: ApproveEnrollmentDto,
  ): Promise<{ approved: number; failed: number }> {
    const batch = await this.classBatchModel.findByPk(batchId);

    if (!batch) {
      throw new NotFoundException(`Class batch with ID ${batchId} not found`);
    }

    const classType = await this.classTypeModel.findByPk(batch.classTypeId);

    const where: any = {
      batchId: batch.id,
      enrollmentStatus: 'enrolled',
    };

    // Support both memberIds and enrollmentIds
    if (approveDto.memberIds && approveDto.memberIds.length > 0) {
      where.memberId = { [Op.in]: approveDto.memberIds };
    } else if (
      approveDto.enrollmentIds &&
      approveDto.enrollmentIds.length > 0
    ) {
      where.id = { [Op.in]: approveDto.enrollmentIds };
    }

    const enrollments = await this.classEnrollmentModel.findAll({ where });

    if (enrollments.length === 0) {
      throw new BadRequestException('No pending enrollments found');
    }

    let approved = 0;
    let failed = 0;

    if (
      approveDto.action === 'approve' ||
      approveDto.action === 'approve_all'
    ) {
      // Approve enrollments
      for (const enrollment of enrollments) {
        const updateData: any = {
          enrollmentStatus: 'approved',
          decidedAt: new Date(),
        };

        // For ETS, automatically mark as ready for graduation and band eligible when approved
        if (classType.code === 'ETS') {
          updateData.graduationStatus = 'ready';
          updateData.bandEligible = true;
        }

        await enrollment.update(updateData);
        approved++;

        // For Baptismal, auto-migrate to ETS
        if (classType.code === 'BAPTISMAL') {
          await this.autoMigrateToETS(enrollment.memberId);
        }
      }
    } else if (
      approveDto.action === 'fail' ||
      approveDto.action === 'fail_all'
    ) {
      // Fail enrollments and roll over to next batch
      for (const enrollment of enrollments) {
        await enrollment.update({
          enrollmentStatus: 'failed',
          decidedAt: new Date(),
        });
        failed++;

        // Roll over to next batch
        await this.rollOverToNextBatch(
          enrollment.memberId,
          classType.code,
          batch.year,
          batch.intake,
        );
      }
    }

    return { approved, failed };
  }

  /**
   * Assign class batch leadership
   */
  async assignClassLeadership(
    batchId: string,
    assignDto: AssignClassLeadershipDto,
  ): Promise<LeadershipAssignment> {
    const batch = await this.classBatchModel.findByPk(batchId);

    if (!batch) {
      throw new NotFoundException(`Class batch with ID ${batchId} not found`);
    }

    const member = await this.memberModel.findByPk(assignDto.memberId);

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    // Format role name
    const roleNameFormatted = assignDto.role
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Find or create role template
    let roleTemplate = await this.leadershipRoleTemplateModel.findOne({
      where: {
        name: roleNameFormatted,
        category: 'CLASS',
      },
    });

    if (!roleTemplate) {
      roleTemplate = await this.leadershipRoleTemplateModel.create({
        name: roleNameFormatted,
        category: 'CLASS',
        scopeType: 'contextual',
        requiresTenure: true,
        defaultTenureMonths: 12,
      });
    }

    const startDate = assignDto.startDate
      ? new Date(assignDto.startDate)
      : new Date();
    const endDate = assignDto.endDate
      ? new Date(assignDto.endDate)
      : new Date(
          startDate.getFullYear() + 1,
          startDate.getMonth(),
          startDate.getDate(),
        );

    // Check for existing assignment
    const existing = await this.leadershipAssignmentModel.findOne({
      where: {
        templateId: roleTemplate.id,
        scopeEntity: 'CLASS_BATCH',
        scopeId: batchId,
        leadershipStatus: 'active',
      },
    });

    if (existing) {
      await existing.update({
        leadershipStatus: 'ended',
        endDate: new Date(),
        endReason: 'replaced',
      });
    }

    return this.leadershipAssignmentModel.create({
      templateId: roleTemplate.id,
      memberId: assignDto.memberId,
      scopeEntity: 'CLASS_BATCH',
      scopeId: batchId,
      startDate,
      endDate,
      leadershipStatus: 'active',
    });
  }

  /**
   * Approve Pre-Youth enrollments (mark as ready for graduation)
   */
  async approvePreYouthEnrollments(
    batchId: string,
    memberIds?: string[],
    enrollmentIds?: string[],
  ): Promise<{ approved: number; message: string }> {
    const batch = await this.classBatchModel.findByPk(batchId, {
      include: [{ model: ClassType }],
    });

    if (!batch) {
      throw new NotFoundException(`Batch with ID ${batchId} not found`);
    }

    if (batch.classType.code !== 'PREYOUTH') {
      throw new BadRequestException(
        'This endpoint is only for Pre-Youth batches',
      );
    }

    const where: any = {
      batchId: batch.id,
      graduationStatus: 'not_ready',
    };

    // Support both memberIds and enrollmentIds
    if (memberIds && memberIds.length > 0) {
      where.memberId = { [Op.in]: memberIds };
    } else if (enrollmentIds && enrollmentIds.length > 0) {
      where.id = { [Op.in]: enrollmentIds };
    }

    const enrollments = await this.classEnrollmentModel.findAll({ where });

    if (enrollments.length === 0) {
      throw new BadRequestException('No enrollments found to approve');
    }

    let approved = 0;
    for (const enrollment of enrollments) {
      await enrollment.update({
        graduationStatus: 'ready',
      });
      approved++;
    }

    return {
      approved,
      message: `${approved} member(s) marked as ready for graduation`,
    };
  }

  /**
   * Mark Baptismal members as ready for graduation
   */
  async markBaptismalMembersReady(
    batchId: string,
    memberIds?: string[],
    enrollmentIds?: string[],
  ): Promise<{ approved: number; message: string; invalidIds?: string[] }> {
    const batch = await this.classBatchModel.findByPk(batchId, {
      include: [{ model: ClassType }],
    });

    if (!batch) {
      throw new NotFoundException(`Batch with ID ${batchId} not found`);
    }

    if (batch.classType.code !== 'BAPTISMAL') {
      throw new BadRequestException(
        'This endpoint is only for Baptismal batches',
      );
    }

    // Validate UUIDs and filter out invalid ones
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const invalidIds: string[] = [];
    let validMemberIds: string[] = [];
    let validEnrollmentIds: string[] = [];

    if (memberIds && memberIds.length > 0) {
      validMemberIds = memberIds.filter((id) => {
        if (uuidRegex.test(id)) {
          return true;
        } else {
          invalidIds.push(id);
          return false;
        }
      });
    }

    if (enrollmentIds && enrollmentIds.length > 0) {
      validEnrollmentIds = enrollmentIds.filter((id) => {
        if (uuidRegex.test(id)) {
          return true;
        } else {
          invalidIds.push(id);
          return false;
        }
      });
    }

    // If all IDs were invalid, throw an error
    if (
      invalidIds.length > 0 &&
      (memberIds?.length === invalidIds.length ||
        enrollmentIds?.length === invalidIds.length)
    ) {
      throw new BadRequestException(
        `Invalid UUID(s) provided: ${invalidIds.join(', ')}. Please provide valid UUID format (e.g., c1fa5d28-4099-490f-bb0a-5cca84d9aef4)`,
      );
    }

    const where: any = {
      batchId: batch.id,
      enrollmentStatus: 'approved', // Only mark approved members as ready
      graduationStatus: 'not_ready',
    };

    // Support both memberIds and enrollmentIds
    if (validMemberIds.length > 0) {
      where.memberId = { [Op.in]: validMemberIds };
    } else if (validEnrollmentIds.length > 0) {
      where.id = { [Op.in]: validEnrollmentIds };
    }

    const enrollments = await this.classEnrollmentModel.findAll({ where });

    if (enrollments.length === 0) {
      throw new BadRequestException(
        'No approved enrollments found to mark as ready for graduation',
      );
    }

    let approved = 0;
    for (const enrollment of enrollments) {
      await enrollment.update({
        graduationStatus: 'ready',
      });
      approved++;
    }

    const response: any = {
      approved,
      message: `${approved} member(s) marked as ready for graduation`,
    };

    // Include invalid IDs in response if any were filtered out
    if (invalidIds.length > 0) {
      response.invalidIds = invalidIds;
      response.warning = `Some invalid UUIDs were ignored: ${invalidIds.join(', ')}`;
    }

    return response;
  }

  /**
   * Update enrollment status by member ID and batch ID
   */
  async updateEnrollmentStatusByMember(
    batchId: string,
    memberId: string,
    updateDto: UpdateEnrollmentStatusDto,
  ): Promise<ClassEnrollment> {
    const batch = await this.classBatchModel.findByPk(batchId);

    if (!batch) {
      throw new NotFoundException(`Class batch with ID ${batchId} not found`);
    }

    const enrollment = await this.classEnrollmentModel.findOne({
      where: {
        batchId: batch.id,
        memberId: memberId,
      },
      include: [{ model: ClassBatch, include: [{ model: ClassType }] }],
    });

    if (!enrollment) {
      throw new NotFoundException(
        `Enrollment not found for member ${memberId} in batch ${batchId}`,
      );
    }

    return this.updateEnrollmentStatus(enrollment.id, updateDto);
  }

  /**
   * Remove member from class batch
   * Prevents removal if member has completed/graduated
   */
  async removeMemberFromBatch(
    batchId: string,
    memberId: string,
  ): Promise<{ message: string }> {
    const batch = await this.classBatchModel.findByPk(batchId);

    if (!batch) {
      throw new NotFoundException(`Class batch with ID ${batchId} not found`);
    }

    const enrollment = await this.classEnrollmentModel.findOne({
      where: {
        batchId: batch.id,
        memberId: memberId,
      },
      include: [{ model: ClassBatch, include: [{ model: ClassType }] }],
    });

    if (!enrollment) {
      throw new NotFoundException(
        `Enrollment not found for member ${memberId} in batch ${batchId}`,
      );
    }

    // Prevent removal if member has completed/graduated
    if (
      enrollment.enrollmentStatus === 'approved' &&
      enrollment.graduationStatus === 'ready'
    ) {
      throw new BadRequestException(
        'Cannot remove member who has completed and graduated from the class',
      );
    }

    // Actually delete the enrollment record (hard delete)
    // This removes the member from the batch entirely, unlike the approve/fail workflow
    // which uses status updates for enrollment management
    await enrollment.destroy();

    return {
      message: 'Member removed from batch successfully',
    };
  }

  /**
   * Update enrollment status (for Pre-Youth graduation status, attendance, etc.)
   */
  async updateEnrollmentStatus(
    enrollmentId: string,
    updateDto: UpdateEnrollmentStatusDto,
  ): Promise<ClassEnrollment> {
    const enrollment = await this.classEnrollmentModel.findByPk(enrollmentId, {
      include: [{ model: ClassBatch, include: [{ model: ClassType }] }],
    });

    if (!enrollment) {
      throw new NotFoundException(
        `Enrollment with ID ${enrollmentId} not found`,
      );
    }

    const updateData: any = {};

    if (updateDto.enrollmentStatus) {
      updateData.enrollmentStatus = updateDto.enrollmentStatus;
      if (
        updateDto.enrollmentStatus === 'approved' ||
        updateDto.enrollmentStatus === 'failed'
      ) {
        updateData.decidedAt = new Date();
      }
    }

    if (updateDto.graduationStatus) {
      updateData.graduationStatus = updateDto.graduationStatus;

      // For ETS, automatically set bandEligible to true when graduation status is set to 'ready'
      if (
        updateDto.graduationStatus === 'ready' &&
        enrollment.batch?.classType?.code === 'ETS'
      ) {
        updateData.bandEligible = true;
      }
    }

    if (updateDto.bandEligible !== undefined) {
      updateData.bandEligible = updateDto.bandEligible;
    }

    if (updateDto.sessionsAttended !== undefined) {
      updateData.sessionsAttended = updateDto.sessionsAttended;
    }

    if (updateDto.totalSessions !== undefined) {
      updateData.totalSessions = updateDto.totalSessions;
    }

    await enrollment.update(updateData);

    // If approving Baptismal enrollment, auto-migrate to ETS
    if (
      updateDto.enrollmentStatus === 'approved' &&
      enrollment.batch?.classType?.code === 'BAPTISMAL'
    ) {
      await this.autoMigrateToETS(enrollment.memberId);
    }

    // If failing enrollment, roll over to next batch
    if (
      updateDto.enrollmentStatus === 'failed' &&
      enrollment.batch?.classType
    ) {
      await this.rollOverToNextBatch(
        enrollment.memberId,
        enrollment.batch.classType.code,
        enrollment.batch.year,
        enrollment.batch.intake,
      );
    }

    return enrollment.reload();
  }

  /**
   * Get batch leadership
   */
  private async getBatchLeadership(
    batchId: string,
  ): Promise<ClassBatchLeadershipDto[]> {
    const assignments = await this.leadershipAssignmentModel.findAll({
      where: {
        scopeEntity: 'CLASS_BATCH',
        scopeId: batchId,
        leadershipStatus: { [Op.in]: ['active', 'acting'] },
      },
      include: [
        {
          model: LeadershipRoleTemplate,
          attributes: ['id', 'name'],
        },
        {
          model: Member,
          attributes: [
            'id',
            'firstName',
            'middleName',
            'surname',
            'email',
            'phone',
          ],
        },
      ],
      order: [['startDate', 'DESC']],
    });

    return assignments.map((assignment) => {
      const member = assignment.member;
      const name = [member.firstName, member.middleName, member.surname]
        .filter(Boolean)
        .join(' ');

      return {
        id: assignment.id,
        name: name || 'Unknown',
        role: assignment.template?.name || 'Unknown Role',
        startDate: assignment.startDate,
        endDate: assignment.endDate || undefined,
        email: member.email,
        phone: member.phone,
        status: assignment.leadershipStatus,
      };
    });
  }

  /**
   * Generate batch code
   * Formats:
   * - Pre-Youth (ANNUAL): PY2026
   * - Baptismal (JAN/AUG): BCJAN2025, BCAUG2025
   * - ETS (JAN/AUG): ETJAN2025, ETAUG2025
   */
  private generateBatchCode(
    classTypeCode: string,
    year: number,
    intake: string,
  ): string {
    // Map class type codes to proper prefixes
    const prefixMap: { [key: string]: string } = {
      PREYOUTH: 'PY',
      BAPTISMAL: 'BC',
      ETS: 'ET',
    };

    const prefix = prefixMap[classTypeCode] || classTypeCode.substring(0, 2);
    const yearStr = year.toString();

    // For ANNUAL intake (Pre-Youth), format is PY2026
    if (intake === 'ANNUAL') {
      return `${prefix}${yearStr}`;
    }

    // For biannual (JAN/AUG), format is BCJAN2025 or BCAUG2025
    return `${prefix}${intake}${yearStr}`;
  }

  /**
   * Calculate age from date of birth
   */
  private calculateAge(dob: Date): number {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

  /**
   * Auto-migrate approved Baptismal members to ETS
   */
  private async autoMigrateToETS(memberId: string): Promise<void> {
    // Find current active ETS batch
    const etsType = await this.classTypeModel.findOne({
      where: { code: 'ETS' },
    });

    if (!etsType) {
      return; // ETS class type doesn't exist
    }

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    // Determine which intake period we're in
    let intake: string;
    if (currentMonth >= 0 && currentMonth < 7) {
      // January to July - use January batch
      intake = 'JAN';
    } else {
      // August to December - use August batch
      intake = 'AUG';
    }

    const etsBatch = await this.classBatchModel.findOne({
      where: {
        classTypeId: etsType.id,
        year: currentYear,
        intake,
        status: { [Op.in]: ['open', 'started'] },
      },
    });

    if (etsBatch) {
      // Check if member is already enrolled
      const existing = await this.classEnrollmentModel.findOne({
        where: {
          batchId: etsBatch.id,
          memberId,
          enrollmentStatus: { [Op.in]: ['enrolled', 'approved'] },
        },
      });

      if (!existing) {
        await this.classEnrollmentModel.create({
          batchId: etsBatch.id,
          memberId,
          attemptNo: 1,
          enrollmentStatus: 'enrolled',
          source: 'auto_migrate',
          enrolledAt: new Date(),
          sessionsAttended: 0,
          graduationStatus: 'not_ready',
          bandEligible: false,
        });
      }
    }
  }

  /**
   * Roll over failed members to next batch
   */
  private async rollOverToNextBatch(
    memberId: string,
    classTypeCode: string,
    currentYear: number,
    currentIntake: string,
  ): Promise<void> {
    const classType = await this.classTypeModel.findOne({
      where: { code: classTypeCode },
    });

    if (!classType) {
      return;
    }

    // Determine next batch
    let nextYear = currentYear;
    let nextIntake: string;

    if (classType.cadence === 'biannual') {
      if (currentIntake === 'JAN') {
        nextIntake = 'AUG';
      } else {
        nextIntake = 'JAN';
        nextYear = currentYear + 1;
      }
    } else {
      // Annual - next year
      nextYear = currentYear + 1;
      nextIntake = 'ANNUAL';
    }

    const nextBatch = await this.classBatchModel.findOne({
      where: {
        classTypeId: classType.id,
        year: nextYear,
        intake: nextIntake,
      },
    });

    if (nextBatch) {
      // Get attempt number
      const allBatches = await this.classBatchModel.findAll({
        where: { classTypeId: classType.id },
      });
      const batchIds = allBatches.map((b) => b.id);

      const previousEnrollments = await this.classEnrollmentModel.findAll({
        where: {
          memberId,
          batchId: { [Op.in]: batchIds },
        },
        order: [['attemptNo', 'DESC']],
      });

      const attemptNo =
        previousEnrollments.length > 0
          ? previousEnrollments[0].attemptNo + 1
          : 1;

      await this.classEnrollmentModel.create({
        batchId: nextBatch.id,
        memberId,
        attemptNo,
        enrollmentStatus: 'enrolled',
        source: 'auto_migrate',
        enrolledAt: new Date(),
        sessionsAttended: 0,
        graduationStatus: 'not_ready',
        bandEligible: false,
      });
    }
  }
}
