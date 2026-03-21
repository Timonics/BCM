import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ReportHistory } from '../../database/models/report-history.model';
import { Member } from '../../database/models/member.model';
import { Band } from '../../database/models/band.model';
import { Unit } from '../../database/models/unit.model';
import { LeadershipAssignment } from '../../database/models/leadership-assignment.model';
import { AttendanceRecord } from '../../database/models/attendance-record.model';
import { AttendanceSession } from '../../database/models/attendance-session.model';
import { GenerateReportDto } from './dto/generate-report.dto';
import { ReportOverviewDto } from './dto/report-overview.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(ReportHistory)
    private reportHistoryModel: typeof ReportHistory,
    @InjectModel(Member)
    private memberModel: typeof Member,
    @InjectModel(Band)
    private bandModel: typeof Band,
    @InjectModel(Unit)
    private unitModel: typeof Unit,
    @InjectModel(LeadershipAssignment)
    private leadershipAssignmentModel: typeof LeadershipAssignment,
    @InjectModel(AttendanceRecord)
    private attendanceRecordModel: typeof AttendanceRecord,
    @InjectModel(AttendanceSession)
    private attendanceSessionModel: typeof AttendanceSession,
  ) {}

  async getOverview(): Promise<ReportOverviewDto> {
    const totalMembers = await this.memberModel.count({
      where: { suspensionStatus: 'active' },
    });
    const activeLeaders = (await this.leadershipAssignmentModel.count({
      where: { leadershipStatus: 'active' },
      distinct: true,
      col: 'memberId',
    })) as unknown as number;
    const activeBands = await this.bandModel.count({
      where: { status: 'active' },
    });
    const activeUnits = await this.unitModel.count({
      where: { status: 'active' },
    });

    // History Stats
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const reportsThisMonth = await this.reportHistoryModel.count({
      where: { createdAt: { [Op.gte]: startOfMonth } },
    });

    const attendanceRecords = await this.attendanceRecordModel.count({
      where: { createdAt: { [Op.gte]: startOfYear } },
    });

    const totalExports = await this.reportHistoryModel.count({
      where: { createdAt: { [Op.gte]: startOfYear } },
    });

    const lastReport = await this.reportHistoryModel.findOne({
      order: [['createdAt', 'DESC']],
    });

    let lastReportGenerated = null;
    if (lastReport) {
      lastReportGenerated = lastReport.createdAt.toISOString();
    }

    const mostGeneratedQuery = await this.reportHistoryModel.findAll({
      attributes: [
        'category',
        'type',
        [this.reportHistoryModel.sequelize.fn('COUNT', '*'), 'count'],
      ],
      group: ['category', 'type'],
      order: [[this.reportHistoryModel.sequelize.fn('COUNT', '*'), 'DESC']],
      limit: 1,
      raw: true,
    });

    let mostGeneratedTitle = null;
    if (mostGeneratedQuery.length > 0) {
      mostGeneratedTitle =
        (mostGeneratedQuery[0] as any).type ||
        (mostGeneratedQuery[0] as any).category;
    }

    return {
      totalMembers,
      activeLeaders,
      activeBandsAndUnits: activeBands + activeUnits,
      attendanceRecords,
      lastReportGenerated,
      reportsThisMonth,
      mostGenerated: mostGeneratedTitle,
      totalExports,
    };
  }

  async generateReport(dto: GenerateReportDto, userId?: string) {
  
    const sanitizedType = dto.type.replace(/\s+/g, '-').toLowerCase();
    const fileUrl = `/downloads/reports/${sanitizedType}-${Date.now()}.${dto.exportFormat.toLowerCase()}`;

    // Track the analytics into history
    const report = await this.reportHistoryModel.create({
      category: dto.category,
      type: dto.type,
      format: dto.exportFormat,
      dateRange: dto.dateRange,
      filters: dto.filters,
      generatedBy: userId,
      fileUrl,
    });

    return report;
  }

  async getReportHistory(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    const { rows, count } = await this.reportHistoryModel.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return {
      data: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    };
  }
}
