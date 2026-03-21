import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { AttendanceRecord } from '../../database/models/attendance-record.model';
import { AttendanceSession } from '../../database/models/attendance-session.model';
import { Band } from '../../database/models/band.model';
import { BandMembership } from '../../database/models/band-membership.model';
import { ClassBatch } from '../../database/models/class-batch.model';
import { ClassEnrollment } from '../../database/models/class-enrollment.model';
import { Project } from '../../database/models/project.model';
import { ProjectMembership } from '../../database/models/project-membership.model';
import { Unit } from '../../database/models/unit.model';
import { UnitMembership } from '../../database/models/unit-membership.model';
import { Member } from '../../database/models/member.model';
import { User } from '../../database/models/user.model';
import { AttendanceReportQueryDto } from './dto/attendance-report-query.dto';
import { CreateAttendanceSessionDto } from './dto/create-attendance-session.dto';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { QueryAttendanceSessionsDto } from './dto/query-attendance-sessions.dto';
import { SubmitQuickCountDto } from './dto/submit-quick-count.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(AttendanceSession)
    private attendanceSessionModel: typeof AttendanceSession,
    @InjectModel(AttendanceRecord)
    private attendanceRecordModel: typeof AttendanceRecord,
    @InjectModel(Band)
    private bandModel: typeof Band,
    @InjectModel(BandMembership)
    private bandMembershipModel: typeof BandMembership,
    @InjectModel(Unit)
    private unitModel: typeof Unit,
    @InjectModel(UnitMembership)
    private unitMembershipModel: typeof UnitMembership,
    @InjectModel(ClassBatch)
    private classBatchModel: typeof ClassBatch,
    @InjectModel(ClassEnrollment)
    private classEnrollmentModel: typeof ClassEnrollment,
    @InjectModel(Project)
    private projectModel: typeof Project,
    @InjectModel(ProjectMembership)
    private projectMembershipModel: typeof ProjectMembership,
    @InjectModel(Member)
    private memberModel: typeof Member,
  ) {}

  async createAttendanceSession(
    createAttendanceSessionDto: CreateAttendanceSessionDto,
    user: User,
  ): Promise<AttendanceSession> {
    const { entityId, sessionType, markingMode } = createAttendanceSessionDto;
    const sessionDate = this.normalizeDateOnly(
      createAttendanceSessionDto.sessionDate,
    );

    this.ensureSessionDateIsNotInPast(sessionDate);

    const resolvedEntity = await this.resolveSessionEntity(
      sessionType,
      entityId,
    );

    const createData = {
      ...createAttendanceSessionDto,
      sessionDate,
      entityId: resolvedEntity.entityId,
      entityType: resolvedEntity.entityType,
      totalExpected: resolvedEntity.totalExpected,
      totalMarked: 0,
      quickCountTotal:
        markingMode === 'Quick Count' || markingMode === 'Hybrid' ? 0 : null,
      status: 'Open',
      createdBy: user.id,
    };

    return this.attendanceSessionModel.create(createData as any);
  }

  async getAttendanceSessions(query: QueryAttendanceSessionsDto) {
    const where: any = {};

    if (query.startDate || query.endDate) {
      where.sessionDate = {};

      if (query.startDate) {
        where.sessionDate[Op.gte] = query.startDate;
      }

      if (query.endDate) {
        where.sessionDate[Op.lte] = query.endDate;
      }
    }

    if (query.type) {
      where.sessionType = this.parseSessionType(query.type);
    }

    if (query.status) {
      where.status = this.parseSessionStatus(query.status);
    }

    const sessions = await this.attendanceSessionModel.findAll({
      where,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'fullName'],
          required: false,
        },
      ],
      order: [
        ['sessionDate', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    });

    return sessions.map((session) => this.mapAttendanceSessionSummary(session));
  }

  async getAttendanceReports(query: AttendanceReportQueryDto) {
    if (query.startDate && query.endDate && query.startDate > query.endDate) {
      throw new BadRequestException('startDate cannot be later than endDate');
    }

    const where: any = {};

    if (query.startDate || query.endDate) {
      where.sessionDate = {};

      if (query.startDate) {
        where.sessionDate[Op.gte] = query.startDate;
      }

      if (query.endDate) {
        where.sessionDate[Op.lte] = query.endDate;
      }
    }

    if (query.groupBy) {
      where.sessionType = query.groupBy;
    }

    const sessions = await this.attendanceSessionModel.findAll({
      where,
      order: [
        ['sessionDate', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    });

    const totalSessions = sessions.length;
    const totalMembers = sessions.reduce(
      (sum, session) => sum + (session.totalExpected ?? 0),
      0,
    );
    const totalPresent = sessions.reduce(
      (sum, session) =>
        sum + (session.totalMarked ?? session.quickCountTotal ?? 0),
      0,
    );
    const totalAbsent = Math.max(totalMembers - totalPresent, 0);
    const averageAttendanceRate =
      totalMembers > 0
        ? Number(((totalPresent / totalMembers) * 100).toFixed(1))
        : 0;

    return {
      success: true,
      data: {
        period: {
          startDate: query.startDate ?? null,
          endDate: query.endDate ?? null,
        },
        sessionType: query.groupBy ?? null,
        summary: {
          totalSessions,
          totalMembers,
          present: totalPresent,
          absent: totalAbsent,
          attendanceRate: averageAttendanceRate,
        },
      },
    };
  }

  async getAttendanceSessionById(id: string) {
    const session = await this.getAttendanceSessionOrThrow(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'fullName', 'email'],
          required: false,
        },
      ],
    });

    if (!session) {
      throw new NotFoundException(`Attendance session with ID ${id} not found`);
    }

    return {
      id: session.id,
      title: session.title,
      description: session.description,
      sessionType: session.sessionType,
      sessionDate: this.formatDateOnly(session.sessionDate),
      attendanceMode: session.attendanceMode,
      markingMode: session.markingMode,
      status: session.status,
      entityId: session.entityId,
      entityType: session.entityType,
      totalExpected: session.totalExpected ?? 0,
      totalMarked: session.totalMarked ?? 0,
      quickCountTotal: session.quickCountTotal ?? 0,
      createdBy: {
        id: session.creator?.id || session.createdBy,
        name: session.creator?.fullName || null,
        email: session.creator?.email || null,
      },
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }

  async markAttendance(sessionId: string, dto: MarkAttendanceDto, user: User) {
    const session = await this.validateMarkableSession(sessionId);
    const memberByIdentifier = await this.resolveAttendanceMembers(dto);
    await this.upsertAttendanceRecords(
      sessionId,
      dto,
      user,
      memberByIdentifier,
    );

    const totalMarked = await this.attendanceRecordModel.count({
      where: { sessionId },
    });
    const { maleCount, femaleCount } =
      await this.calculateMarkedGenderCounts(sessionId);

    await session.update({
      totalMarked,
      maleCount,
      femaleCount,
      status: totalMarked > 0 ? 'Marked' : session.status,
    });

    return {
      success: true,
      message: 'Attendance marked successfully',
      data: {
        sessionId: session.id,
        attendeesProcessed: dto.attendees.length,
        totalMarked,
      },
    };
  }

  async submitQuickCount(sessionId: string, dto: SubmitQuickCountDto) {
    const session = await this.validateQuickCountSession(sessionId);

    if (dto.maleCount + dto.femaleCount !== dto.totalCount) {
      throw new BadRequestException(
        'maleCount and femaleCount must add up to totalCount',
      );
    }

    await session.update({
      maleCount: dto.maleCount,
      femaleCount: dto.femaleCount,
      quickCountTotal: dto.totalCount,
      totalMarked: dto.totalCount,
      status: dto.totalCount > 0 ? 'Marked' : session.status,
    });

    return {
      success: true,
      message: 'Quick count submitted successfully',
      data: {
        sessionId: session.id,
        maleCount: dto.maleCount,
        femaleCount: dto.femaleCount,
        totalCount: dto.totalCount,
      },
    };
  }

  async closeAttendanceSession(sessionId: string) {
    const session = await this.getAttendanceSessionOrThrow(sessionId);

    if (session.status === 'Closed') {
      throw new BadRequestException('Attendance session is already closed');
    }

    const totalMembers = session.totalExpected ?? 0;
    const present = session.totalMarked ?? session.quickCountTotal ?? 0;
    const absent = Math.max(totalMembers - present, 0);
    const attendanceRate =
      totalMembers > 0
        ? Number(((present / totalMembers) * 100).toFixed(1))
        : 0;

    await session.update({
      status: 'Closed',
      totalMarked: present,
    });

    return {
      success: true,
      message: 'Session closed successfully',
      finalStats: {
        totalMembers,
        present,
        absent,
        attendanceRate,
      },
    };
  }

  private async validateMarkableSession(sessionId: string) {
    const session = await this.getAttendanceSessionOrThrow(sessionId);

    if (session.status === 'Closed') {
      throw new BadRequestException(
        'Attendance cannot be marked for a closed session',
      );
    }

    if (session.markingMode === 'Quick Count') {
      throw new BadRequestException(
        'Manual attendance marking is not allowed for Quick Count sessions',
      );
    }

    return session;
  }

  private async validateQuickCountSession(sessionId: string) {
    const session = await this.getAttendanceSessionOrThrow(sessionId);

    if (session.status === 'Closed') {
      throw new BadRequestException(
        'Quick count cannot be submitted for a closed session',
      );
    }

    if (
      session.markingMode !== 'Quick Count' &&
      session.markingMode !== 'Hybrid'
    ) {
      throw new BadRequestException(
        'Quick count is only allowed for Quick Count or Hybrid sessions',
      );
    }

    return session;
  }

  private async getAttendanceSessionOrThrow(
    sessionId: string,
    options?: Parameters<typeof this.attendanceSessionModel.findByPk>[1],
  ) {
    const session = await this.attendanceSessionModel.findByPk(
      sessionId,
      options,
    );

    if (!session) {
      throw new NotFoundException(
        `Attendance session with ID ${sessionId} not found`,
      );
    }

    return session;
  }

  private async resolveAttendanceMembers(dto: MarkAttendanceDto) {
    const identifiers = [
      ...new Set(dto.attendees.map((attendee) => attendee.memberId.trim())),
    ];
    const uuidIdentifiers = identifiers.filter((identifier) =>
      this.isUuid(identifier),
    );
    const memberCodeIdentifiers = identifiers.filter(
      (identifier) => !this.isUuid(identifier),
    );
    const memberWhere: any[] = [];

    if (uuidIdentifiers.length > 0) {
      memberWhere.push({ id: { [Op.in]: uuidIdentifiers } });
    }

    if (memberCodeIdentifiers.length > 0) {
      memberWhere.push({ memberCode: { [Op.in]: memberCodeIdentifiers } });
    }

    const members = await this.memberModel.findAll({
      where: {
        [Op.or]: memberWhere,
      },
      attributes: ['id', 'memberCode'],
    });

    const memberByIdentifier = new Map<string, Member>();
    for (const member of members) {
      memberByIdentifier.set(member.id, member);
      if (member.memberCode) {
        memberByIdentifier.set(member.memberCode, member);
      }
    }

    for (const attendee of dto.attendees) {
      if (!memberByIdentifier.has(attendee.memberId.trim())) {
        throw new NotFoundException(
          `Member ${attendee.memberId} was not found`,
        );
      }
    }

    return memberByIdentifier;
  }

  private async upsertAttendanceRecords(
    sessionId: string,
    dto: MarkAttendanceDto,
    user: User,
    memberByIdentifier: Map<string, Member>,
  ) {
    const existingRecords = await this.attendanceRecordModel.findAll({
      where: {
        sessionId,
        memberId: {
          [Op.in]: [
            ...new Set(
              Array.from(memberByIdentifier.values()).map(
                (member) => member.id,
              ),
            ),
          ],
        },
      },
    });

    const recordByMemberId = new Map(
      existingRecords.map((record) => [record.memberId, record]),
    );

    for (const attendee of dto.attendees) {
      const member = memberByIdentifier.get(attendee.memberId.trim())!;
      const attendanceStatus = this.parseAttendanceStatus(attendee.status);
      const checkInTime = attendee.timestamp
        ? new Date(attendee.timestamp)
        : null;
      const existingRecord = recordByMemberId.get(member.id);

      if (existingRecord) {
        await existingRecord.update({
          attendanceStatus,
          checkInTime,
          markedBy: user.id,
        });
        continue;
      }

      await this.attendanceRecordModel.create({
        sessionId,
        memberId: member.id,
        attendanceStatus,
        checkInTime,
        markedBy: user.id,
      } as any);
    }
  }

  private async calculateMarkedGenderCounts(sessionId: string) {
    const records = await this.attendanceRecordModel.findAll({
      where: { sessionId },
      include: [
        {
          model: Member,
          as: 'member',
          attributes: ['id', 'gender'],
          required: true,
        },
      ],
    });

    let maleCount = 0;
    let femaleCount = 0;

    for (const record of records) {
      if (record.member?.gender === 'male') {
        maleCount++;
      } else if (record.member?.gender === 'female') {
        femaleCount++;
      }
    }

    return { maleCount, femaleCount };
  }

  private async resolveSessionEntity(sessionType: string, entityId?: string) {
    switch (sessionType) {
      case 'Band Meeting':
        return this.resolveBandMeeting(entityId);
      case 'Unit Meeting':
        return this.resolveUnitMeeting(entityId);
      case 'Class Session':
        return this.resolveClassSession(entityId);
      case 'Committee Meeting':
        return this.resolveCommitteeMeeting(entityId);
      case 'General Service':
      case 'Special Program':
        if (entityId) {
          throw new BadRequestException(
            `${sessionType} should not include entityId`,
          );
        }

        return {
          entityId: null,
          entityType: null,
          totalExpected: null,
        };
      default:
        throw new BadRequestException('Invalid session type');
    }
  }

  private async resolveBandMeeting(entityId?: string) {
    if (!entityId) {
      throw new BadRequestException(
        'entityId is required for a Band Meeting session',
      );
    }

    const band = await this.bandModel.findByPk(entityId);
    if (!band) {
      throw new NotFoundException(`Band with ID ${entityId} not found`);
    }

    const totalExpected = await this.bandMembershipModel.count({
      where: { bandId: entityId, isActive: true },
    });

    return {
      entityId,
      entityType: 'band',
      totalExpected,
    };
  }

  private async resolveUnitMeeting(entityId?: string) {
    if (!entityId) {
      throw new BadRequestException(
        'entityId is required for a Unit Meeting session',
      );
    }

    const unit = await this.unitModel.findByPk(entityId);
    if (!unit) {
      throw new NotFoundException(`Unit with ID ${entityId} not found`);
    }

    const totalExpected = await this.unitMembershipModel.count({
      where: { unitId: entityId, isActive: true },
    });

    return {
      entityId,
      entityType: 'unit',
      totalExpected,
    };
  }

  private async resolveClassSession(entityId?: string) {
    if (!entityId) {
      throw new BadRequestException('entityId is required for a Class Session');
    }

    const classBatch = await this.classBatchModel.findByPk(entityId);
    if (!classBatch) {
      throw new NotFoundException(`Class batch with ID ${entityId} not found`);
    }

    const totalExpected = await this.classEnrollmentModel.count({
      where: { batchId: entityId },
    });

    return {
      entityId,
      entityType: 'class',
      totalExpected,
    };
  }

  private async resolveCommitteeMeeting(entityId?: string) {
    if (!entityId) {
      throw new BadRequestException(
        'entityId is required for a Committee Meeting session',
      );
    }

    const project = await this.projectModel.findByPk(entityId);
    if (!project) {
      throw new NotFoundException(`Committee with ID ${entityId} not found`);
    }

    const totalExpected = await this.projectMembershipModel.count({
      where: { projectId: entityId, isActive: true },
    });

    return {
      entityId,
      entityType: 'committee',
      totalExpected,
    };
  }

  private normalizeDateOnly(sessionDate: string): string {
    const parsedDate = new Date(sessionDate);
    if (Number.isNaN(parsedDate.getTime())) {
      throw new BadRequestException('Invalid session date');
    }

    return sessionDate;
  }

  private ensureSessionDateIsNotInPast(sessionDate: string): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parsedSessionDate = new Date(sessionDate);
    parsedSessionDate.setHours(0, 0, 0, 0);

    if (parsedSessionDate < today) {
      throw new BadRequestException('Session date cannot be in the past');
    }
  }

  private parseSessionType(type: string): string {
    const allowedTypes = [
      'General Service',
      'Band Meeting',
      'Unit Meeting',
      'Class Session',
      'Committee Meeting',
      'Special Program',
    ];

    if (!allowedTypes.includes(type)) {
      throw new BadRequestException('Invalid attendance session type filter');
    }

    return type;
  }

  private parseSessionStatus(status: string): string {
    const allowedStatuses = ['Open', 'Marked', 'Closed'];

    if (!allowedStatuses.includes(status)) {
      throw new BadRequestException('Invalid attendance session status filter');
    }

    return status;
  }

  private parseAttendanceStatus(status: string): string {
    const allowedStatuses = ['Present', 'Absent', 'Late', 'Excused'];

    if (!allowedStatuses.includes(status)) {
      throw new BadRequestException('Invalid attendance status');
    }

    return status;
  }

  private toSlug(value: string): string {
    return value.trim().toLowerCase().replace(/\s+/g, '-');
  }

  private formatDateOnly(value: Date | string): string {
    if (typeof value === 'string') {
      return value;
    }

    return value.toISOString().slice(0, 10);
  }

  private isUuid(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    );
  }

  private mapAttendanceSessionSummary(session: AttendanceSession) {
    return {
      id: session.id,
      title: session.title,
      type: session.sessionType,
      date: this.formatDateOnly(session.sessionDate),
      mode: session.attendanceMode ? this.toSlug(session.attendanceMode) : null,
      status: this.toSlug(session.status),
      markingMethod: this.toSlug(session.markingMode),
      totalMembers: session.totalExpected ?? 0,
      markedCount: session.totalMarked ?? 0,
      createdBy: session.creator?.fullName || session.createdBy,
      createdAt: session.createdAt,
    };
  }

}
