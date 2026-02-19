import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Project } from '../../database/models/project.model';
import { ProjectMembership } from '../../database/models/project-membership.model';
import { LeadershipAssignment } from '../../database/models/leadership-assignment.model';
import { LeadershipRoleTemplate } from '../../database/models/leadership-role-template.model';
import { Member } from '../../database/models/member.model';
import { Band } from '../../database/models/band.model';
import { BandMembership } from '../../database/models/band-membership.model';
import { Unit } from '../../database/models/unit.model';
import { UnitMembership } from '../../database/models/unit-membership.model';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectQueryDto } from './dto/project-query.dto';
import { AddCommitteeMemberDto } from './dto/add-committee-member.dto';

@Injectable()
export class CommitteesService {
  constructor(
    @InjectModel(Project)
    private projectModel: typeof Project,
    @InjectModel(ProjectMembership)
    private projectMembershipModel: typeof ProjectMembership,
    @InjectModel(LeadershipAssignment)
    private leadershipAssignmentModel: typeof LeadershipAssignment,
    @InjectModel(LeadershipRoleTemplate)
    private leadershipRoleTemplateModel: typeof LeadershipRoleTemplate,
    @InjectModel(Member)
    private memberModel: typeof Member,
    @InjectModel(Band)
    private bandModel: typeof Band,
    @InjectModel(BandMembership)
    private bandMembershipModel: typeof BandMembership,
    @InjectModel(Unit)
    private unitModel: typeof Unit,
    @InjectModel(UnitMembership)
    private unitMembershipModel: typeof UnitMembership,
  ) {}

  private daysBetween(start: Date, end: Date): number {
    const s = new Date(start);
    const e = new Date(end);
    s.setHours(0, 0, 0, 0);
    e.setHours(0, 0, 0, 0);
    return Math.max(
      0,
      Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)),
    );
  }

  async create(dto: CreateProjectDto): Promise<Project> {
    const data: any = {
      ...dto,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : null,
    };
    return this.projectModel.create(data);
  }

  async findAll(query: ProjectQueryDto) {
    const where: any = {};
    if (query.search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${query.search}%` } },
        { description: { [Op.iLike]: `%${query.search}%` } },
      ];
    }
    if (query.year != null) where.year = query.year;
    if (query.projectType) where.projectType = query.projectType;
    if (query.status) where.status = query.status;

    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 10, 100);
    const offset = (page - 1) * limit;

    const { rows: projects, count: total } =
      await this.projectModel.findAndCountAll({
        where,
        order: [
          ['startDate', 'DESC'],
          ['name', 'ASC'],
        ],
        limit,
        offset,
      });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const result = await Promise.all(
      projects.map(async (p) => {
        const [committeeSize, leadershipCount, expiring, expired] =
          await Promise.all([
            this.projectMembershipModel.count({
              where: { projectId: p.id, isActive: true },
            }),
            this.leadershipAssignmentModel.count({
              where: {
                scopeEntity: 'PROJECT',
                scopeId: p.id,
                leadershipStatus: { [Op.in]: ['active', 'acting'] },
              },
              include: [
                {
                  model: LeadershipRoleTemplate,
                  as: 'template',
                  where: { category: 'COMMITTEE' },
                  required: true,
                },
              ],
            }),
            this.leadershipAssignmentModel.count({
              where: {
                scopeEntity: 'PROJECT',
                scopeId: p.id,
                leadershipStatus: 'active',
                endDate: { [Op.between]: [today, thirtyDaysFromNow] },
              },
            }),
            this.leadershipAssignmentModel.count({
              where: {
                scopeEntity: 'PROJECT',
                scopeId: p.id,
                leadershipStatus: 'active',
                endDate: { [Op.lt]: today },
              },
            }),
          ]);
        const leadershipAlerts = expiring + expired;
        let progressPercent: number | undefined;
        if (p.startDate && p.endDate) {
          const start = new Date(p.startDate).getTime();
          const end = new Date(p.endDate).getTime();
          const now = Date.now();
          if (end > start)
            progressPercent = Math.min(
              100,
              Math.round(((now - start) / (end - start)) * 100),
            );
        }

        return {
          id: p.id,
          name: p.name,
          projectType: p.projectType,
          year: p.year,
          description: p.description,
          startDate: p.startDate,
          endDate: p.endDate,
          status: p.status,
          committeeSize,
          leadershipCount,
          leadershipAlerts: leadershipAlerts > 0 ? leadershipAlerts : undefined,
          progressPercent,
          updatedAt: p.updatedAt,
        };
      }),
    );

    return { data: result, total, page, limit };
  }

  async getOverview() {
    const now = new Date();
    const currentYear = now.getFullYear();

    const [
      activeProjects,
      committeesThisYear,
      archivedProjects,
      totalCommitteeMembers,
    ] = await Promise.all([
      this.projectModel.count({ where: { status: 'active' } }),
      this.projectModel.count({ where: { year: currentYear } }),
      this.projectModel.count({ where: { status: 'archived' } }),
      this.projectMembershipModel.count({
        where: { isActive: true },
        distinct: true,
        col: 'member_id',
      }),
    ]);

    return {
      activeProjects,
      committeesThisYear,
      totalCommitteeMembers,
      archivedProjects,
    };
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectModel.findByPk(id);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async getDetails(id: string) {
    const project = await this.findOne(id);

    const [committeeSize, leadershipCount, leadershipAlerts] =
      await Promise.all([
        this.projectMembershipModel.count({
          where: { projectId: id, isActive: true },
        }),
        this.leadershipAssignmentModel.count({
          where: {
            scopeEntity: 'PROJECT',
            scopeId: id,
            leadershipStatus: { [Op.in]: ['active', 'acting'] },
          },
          include: [
            {
              model: LeadershipRoleTemplate,
              as: 'template',
              where: { category: 'COMMITTEE' },
              required: true,
            },
          ],
        }),
        (async () => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const thirtyDaysFromNow = new Date(today);
          thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
          const [expiring, expired] = await Promise.all([
            this.leadershipAssignmentModel.count({
              where: {
                scopeEntity: 'PROJECT',
                scopeId: id,
                leadershipStatus: 'active',
                endDate: { [Op.between]: [today, thirtyDaysFromNow] },
              },
            }),
            this.leadershipAssignmentModel.count({
              where: {
                scopeEntity: 'PROJECT',
                scopeId: id,
                leadershipStatus: 'active',
                endDate: { [Op.lt]: today },
              },
            }),
          ]);
          return expiring + expired;
        })(),
      ]);

    return {
      id: project.id,
      name: project.name,
      projectType: project.projectType,
      year: project.year,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      status: project.status,
      committeeSize,
      leadershipCount,
      leadershipAlerts,
      updatedAt: project.updatedAt,
    };
  }

  async update(id: string, dto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
    const data: any = { ...dto };
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate !== undefined)
      data.endDate = dto.endDate ? new Date(dto.endDate) : null;
    await project.update(data);
    return project.reload();
  }

  async markCompleted(id: string): Promise<Project> {
    const project = await this.findOne(id);
    await project.update({ status: 'completed' });
    return project.reload();
  }

  async remove(id: string): Promise<{ message: string }> {
    const project = await this.findOne(id);
    const [membershipCount, assignmentCount] = await Promise.all([
      this.projectMembershipModel.count({ where: { projectId: id } }),
      this.leadershipAssignmentModel.count({
        where: { scopeEntity: 'PROJECT', scopeId: id },
      }),
    ]);
    if (membershipCount > 0 || assignmentCount > 0) {
      throw new BadRequestException(
        'Cannot delete project with members or leadership assignments. Remove members and reassign/end leadership first.',
      );
    }
    await project.destroy();
    return { message: 'Project deleted successfully' };
  }

  /**
   * Add a member to a committee/project (plain membership).
   * Assign leadership roles (Chair, Secretary, etc.) separately via the Leadership module.
   */
  async addMemberToCommittee(projectId: string, dto: AddCommitteeMemberDto) {
    await this.findOne(projectId);

    const member = await this.memberModel.findByPk(dto.memberId);
    if (!member) {
      throw new NotFoundException(`Member with ID ${dto.memberId} not found`);
    }

    const existing = await this.projectMembershipModel.findOne({
      where: {
        projectId,
        memberId: dto.memberId,
        isActive: true,
      },
    });
    if (existing) {
      throw new BadRequestException('Member is already on this committee');
    }

    const startDate = dto.startDate ? new Date(dto.startDate) : new Date();
    return this.projectMembershipModel.create({
      projectId,
      memberId: dto.memberId,
      startDate,
      isActive: true,
    });
  }

  /**
   * Remove a member from a committee (deactivates membership).
   */
  async removeMemberFromCommittee(
    projectId: string,
    memberId: string,
  ): Promise<{ message: string }> {
    await this.findOne(projectId);

    const member = await this.memberModel.findByPk(memberId);
    if (!member) {
      throw new NotFoundException('Member not found');
    }

    const membership = await this.projectMembershipModel.findOne({
      where: { projectId, memberId, isActive: true },
    });
    if (!membership) {
      throw new NotFoundException(
        'Member is not currently an active member of this committee',
      );
    }

    await membership.update({
      isActive: false,
      endDate: new Date(),
      exitReason: 'removed',
    });
    return { message: 'Member removed from committee successfully' };
  }

  /**
   * Get committee members (plain membership list with optional leadership role).
   */
  async getCommitteeMembers(projectId: string) {
    await this.findOne(projectId);

    const memberships = await this.projectMembershipModel.findAll({
      where: { projectId, isActive: true },
      include: [
        {
          model: Member,
          as: 'member',
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

    const memberIds = memberships.map((m) => m.memberId);
    const assignments =
      memberIds.length > 0
        ? await this.leadershipAssignmentModel.findAll({
            where: {
              scopeEntity: 'PROJECT',
              scopeId: projectId,
              memberId: { [Op.in]: memberIds },
              leadershipStatus: { [Op.in]: ['active', 'acting'] },
            },
            include: [
              {
                model: LeadershipRoleTemplate,
                as: 'template',
                attributes: ['id', 'name'],
              },
            ],
          })
        : [];
    const roleByMember = new Map<string, string>();
    for (const a of assignments) {
      const name = (a as any).template?.name;
      if (name) roleByMember.set(a.memberId, name);
    }

    return memberships.map((m) => {
      const member = (m as any).member;
      const name = member
        ? [member.firstName, member.middleName, member.surname]
            .filter(Boolean)
            .join(' ')
        : 'Unknown';
      return {
        id: m.id,
        memberId: m.memberId,
        name,
        email: member?.email,
        phone: member?.phone,
        role: roleByMember.get(m.memberId) ?? null,
        startDate: m.startDate,
        joinedAt: m.createdAt,
      };
    });
  }

  async getCommitteeCompositionReport(filters: {
    year?: number;
    projectId?: string;
    roleId?: string;
    memberId?: string;
    search?: string;
  }) {
    const projectWhere: any = {};
    if (filters.year != null) projectWhere.year = filters.year;
    if (filters.projectId) projectWhere.id = filters.projectId;

    const projects = await this.projectModel.findAll({
      where: projectWhere,
      attributes: ['id', 'name', 'projectType'],
    });
    const projectMap = new Map(projects.map((p) => [p.id, p]));
    const projectIds = projects.map((p) => p.id);
    if (projectIds.length === 0) return { data: [], total: 0 };

    const memberships = await this.projectMembershipModel.findAll({
      where: { projectId: { [Op.in]: projectIds }, isActive: true },
      include: [
        {
          model: Member,
          as: 'member',
          attributes: ['id', 'firstName', 'middleName', 'surname', 'email'],
        },
      ],
      order: [['startDate', 'DESC']],
    });

    const rows = memberships
      .filter((m) => projectMap.has(m.projectId))
      .map((m) => {
        const project = projectMap.get(m.projectId)!;
        const member = (m as any).member;
        const name = member
          ? [member.firstName, member.middleName, member.surname]
              .filter(Boolean)
              .join(' ')
          : 'Unknown';
        return {
          membershipId: m.id,
          memberId: m.memberId,
          memberName: name,
          memberEmail: member?.email,
          projectId: project.id,
          projectName: project.name,
          projectType: project.projectType,
          role: 'Member',
          bandName: undefined as string | undefined,
          unitName: undefined as string | undefined,
          startDate: m.startDate,
          endDate: m.endDate ?? undefined,
          daysServed: 0,
          status: 'Active',
        };
      });

    const memberIds = [...new Set(rows.map((r) => r.memberId))];
    const bandMap = new Map<string, string>();
    const unitMap = new Map<string, string>();
    if (memberIds.length > 0) {
      const bandMemberships = await this.bandMembershipModel.findAll({
        where: { memberId: { [Op.in]: memberIds }, isActive: true },
        include: [{ model: Band, as: 'band', attributes: ['id', 'name'] }],
      });
      for (const bm of bandMemberships) {
        const band = (bm as any).band;
        if (band && !bandMap.has(bm.memberId))
          bandMap.set(bm.memberId, band.name);
      }
      const unitMemberships = await this.unitMembershipModel.findAll({
        where: { memberId: { [Op.in]: memberIds }, isActive: true },
        include: [{ model: Unit, as: 'unit', attributes: ['id', 'name'] }],
      });
      for (const um of unitMemberships) {
        const unit = (um as any).unit;
        if (unit && !unitMap.has(um.memberId))
          unitMap.set(um.memberId, unit.name);
      }
    }

    const assignments = await this.leadershipAssignmentModel.findAll({
      where: {
        scopeEntity: 'PROJECT',
        scopeId: { [Op.in]: projectIds },
        memberId: { [Op.in]: memberIds },
        leadershipStatus: { [Op.in]: ['active', 'acting'] },
      },
      include: [
        {
          model: LeadershipRoleTemplate,
          as: 'template',
          attributes: ['id', 'name'],
        },
      ],
    });
    const roleMap = new Map<string, string>();
    for (const a of assignments) {
      const key = `${a.scopeId}:${a.memberId}`;
      const roleName = (a as any).template?.name;
      if (roleName) roleMap.set(key, roleName);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const out = rows.map((r) => {
      const role = roleMap.get(`${r.projectId}:${r.memberId}`) ?? 'Member';
      const startDate =
        r.startDate instanceof Date ? r.startDate : new Date(r.startDate);
      const endDate = r.endDate ? new Date(r.endDate) : today;
      const daysServed = this.daysBetween(startDate, endDate);
      return {
        assignmentId: r.membershipId,
        memberId: r.memberId,
        memberName: r.memberName,
        memberEmail: r.memberEmail,
        projectId: r.projectId,
        projectName: r.projectName,
        projectType: r.projectType,
        role,
        bandName: bandMap.get(r.memberId),
        unitName: unitMap.get(r.memberId),
        startDate: r.startDate,
        endDate: r.endDate,
        daysServed,
        status: r.status,
      };
    });

    let filtered = out;
    if (filters.roleId) {
      const roleIdSet = new Set(
        assignments
          .filter((a) => a.templateId === filters.roleId)
          .map((a) => `${a.scopeId}:${a.memberId}`),
      );
      filtered = filtered.filter((r) =>
        roleIdSet.has(`${r.projectId}:${r.memberId}`),
      );
    }
    if (filters.memberId)
      filtered = filtered.filter((r) => r.memberId === filters.memberId);
    if (filters.search) {
      const s = filters.search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.memberName.toLowerCase().includes(s) ||
          (r.memberEmail || '').toLowerCase().includes(s),
      );
    }

    return { data: filtered, total: filtered.length };
  }

  async getLeadershipParticipationReport(filters: {
    year?: number;
    projectId?: string;
    search?: string;
  }) {
    const where: any = {
      scopeEntity: 'PROJECT',
      leadershipStatus: { [Op.in]: ['active', 'acting', 'ended'] },
    };
    if (filters.projectId) where.scopeId = filters.projectId;

    const assignments = await this.leadershipAssignmentModel.findAll({
      where,
      include: [
        {
          model: LeadershipRoleTemplate,
          as: 'template',
          attributes: ['id', 'name', 'category'],
        },
        {
          model: Member,
          as: 'member',
          attributes: ['id', 'firstName', 'middleName', 'surname', 'email'],
        },
      ],
      order: [['startDate', 'DESC']],
    });

    const projects =
      assignments.length > 0
        ? await this.projectModel.findAll({
            where: {
              id: {
                [Op.in]: [
                  ...new Set(assignments.map((a) => a.scopeId).filter(Boolean)),
                ] as string[],
              },
              ...(filters.year != null ? { year: filters.year } : {}),
            },
            attributes: ['id', 'year', 'status'],
          })
        : [];
    const projectSet = new Set(projects.map((p) => p.id));

    const memberIds = [...new Set(assignments.map((a) => a.memberId))];
    const unitMap = new Map<string, string>();
    if (memberIds.length > 0) {
      const unitMemberships = await this.unitMembershipModel.findAll({
        where: { memberId: { [Op.in]: memberIds }, isActive: true },
        include: [{ model: Unit, as: 'unit', attributes: ['id', 'name'] }],
      });
      for (const um of unitMemberships) {
        const unit = (um as any).unit;
        if (unit && !unitMap.has(um.memberId))
          unitMap.set(um.memberId, unit.name);
      }
    }

    const byMember = new Map<
      string,
      {
        memberId: string;
        memberName: string;
        memberEmail?: string;
        unitName?: string;
        totalProjects: number;
        leadershipRoles: number;
        memberRoles: number;
        activeCount: number;
        completedCount: number;
        totalDaysServed: number;
        positionsHeld: string[];
      }
    >();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const a of assignments) {
      if (!a.scopeId || !projectSet.has(a.scopeId)) continue;
      const project = projects.find((p) => p.id === a.scopeId);
      if (!project) continue;

      const member = (a as any).member;
      const name = member
        ? [member.firstName, member.middleName, member.surname]
            .filter(Boolean)
            .join(' ')
        : 'Unknown';
      const roleName = (a as any).template?.name ?? 'Member';
      const isLeadership =
        (a as any).template?.category === 'COMMITTEE' &&
        !roleName.toLowerCase().includes('member');
      const end = a.endDate ? new Date(a.endDate) : today;
      const days = this.daysBetween(a.startDate, end);
      const isActive =
        project.status === 'active' &&
        ((a as any).leadershipStatus === 'active' ||
          (a as any).leadershipStatus === 'acting');

      if (!byMember.has(a.memberId)) {
        byMember.set(a.memberId, {
          memberId: a.memberId,
          memberName: name,
          memberEmail: member?.email,
          unitName: unitMap.get(a.memberId),
          totalProjects: 0,
          leadershipRoles: 0,
          memberRoles: 0,
          activeCount: 0,
          completedCount: 0,
          totalDaysServed: 0,
          positionsHeld: [],
        });
      }
      const row = byMember.get(a.memberId)!;
      row.totalProjects += 1;
      if (isLeadership) row.leadershipRoles += 1;
      else row.memberRoles += 1;
      if (isActive) row.activeCount += 1;
      else row.completedCount += 1;
      row.totalDaysServed += days;
      if (!row.positionsHeld.includes(roleName))
        row.positionsHeld.push(roleName);
    }

    let data = Array.from(byMember.values());
    if (filters.search) {
      const s = filters.search.toLowerCase();
      data = data.filter(
        (r) =>
          r.memberName.toLowerCase().includes(s) ||
          (r.memberEmail || '').toLowerCase().includes(s),
      );
    }
    return { data, total: data.length };
  }

  async exportCsv(filters: {
    year?: number;
    projectId?: string;
    report: 'composition' | 'leadership-participation';
  }): Promise<string> {
    if (filters.report === 'composition') {
      const { data } = await this.getCommitteeCompositionReport({
        year: filters.year,
        projectId: filters.projectId,
      });
      const headers = [
        'Member Name',
        'Member Email',
        'Project',
        'Project Type',
        'Role',
        'Band',
        'Unit',
        'Start Date',
        'End Date',
        'Days Served',
        'Status',
      ];
      const rows = data.map((r) =>
        [
          r.memberName,
          r.memberEmail ?? '',
          r.projectName,
          r.projectType ?? '',
          r.role,
          r.bandName ?? '',
          r.unitName ?? '',
          r.startDate,
          r.endDate ?? '',
          r.daysServed,
          r.status,
        ]
          .map((c) => `"${String(c).replace(/"/g, '""')}"`)
          .join(','),
      );
      return [headers.join(','), ...rows].join('\n');
    } else {
      const { data } = await this.getLeadershipParticipationReport({
        year: filters.year,
        projectId: filters.projectId,
      });
      const headers = [
        'Member Name',
        'Email',
        'Unit',
        'Total Projects',
        'Leadership Roles',
        'Member Roles',
        'Active',
        'Completed',
        'Total Days Served',
        'Positions Held',
      ];
      const rows = data.map((r) =>
        [
          r.memberName,
          r.memberEmail ?? '',
          r.unitName ?? '',
          r.totalProjects,
          r.leadershipRoles,
          r.memberRoles,
          r.activeCount,
          r.completedCount,
          r.totalDaysServed,
          r.positionsHeld.join('; '),
        ]
          .map((c) => `"${String(c).replace(/"/g, '""')}"`)
          .join(','),
      );
      return [headers.join(','), ...rows].join('\n');
    }
  }
}
