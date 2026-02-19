import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { LeadershipRoleTemplate } from '../../database/models/leadership-role-template.model';
import { LeadershipAssignment } from '../../database/models/leadership-assignment.model';
import { Member } from '../../database/models/member.model';
import { Band } from '../../database/models/band.model';
import { Unit } from '../../database/models/unit.model';
import { ClassBatch } from '../../database/models/class-batch.model';
import { Department } from '../../database/models/department.model';
import { Project } from '../../database/models/project.model';
import { CreateLeadershipRoleDto } from './dto/create-leadership-role.dto';
import { UpdateLeadershipRoleDto } from './dto/update-leadership-role.dto';
import { AssignLeadershipDto } from './dto/assign-leadership.dto';
import { UpdateLeadershipAssignmentDto } from './dto/update-leadership-assignment.dto';
import { LeadershipQueryDto } from './dto/leadership-query.dto';
import { LeadershipOverviewResponseDto } from './dto/leadership-overview-response.dto';
import { LeadershipRoleResponseDto } from './dto/leadership-role-response.dto';
import { LeadershipAssignmentResponseDto } from './dto/leadership-assignment-response.dto';

/**
 * Leadership Service
 * Handles leadership role templates and assignments
 * Supports SIC, Band, Unit, Class, and Committee leadership
 */
@Injectable()
export class LeadershipService {
  constructor(
    @InjectModel(LeadershipRoleTemplate)
    private leadershipRoleTemplateModel: typeof LeadershipRoleTemplate,
    @InjectModel(LeadershipAssignment)
    private leadershipAssignmentModel: typeof LeadershipAssignment,
    @InjectModel(Member)
    private memberModel: typeof Member,
    @InjectModel(Band)
    private bandModel: typeof Band,
    @InjectModel(Unit)
    private unitModel: typeof Unit,
    @InjectModel(ClassBatch)
    private classBatchModel: typeof ClassBatch,
    @InjectModel(Department)
    private departmentModel: typeof Department,
    @InjectModel(Project)
    private projectModel: typeof Project,
  ) {}

  /**
   * Get leadership overview statistics
   */
  async getLeadershipOverview(): Promise<LeadershipOverviewResponseDto> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ninetyDaysFromNow = new Date(today);
    ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);

    // Total active leaders
    const totalActiveLeaders = await this.leadershipAssignmentModel.count({
      where: {
        leadershipStatus: { [Op.in]: ['active', 'acting'] },
      },
    });

    // Roles expiring within 90 days
    const rolesExpiringSoon = await this.leadershipAssignmentModel.count({
      where: {
        leadershipStatus: { [Op.in]: ['active', 'acting'] },
        endDate: {
          [Op.between]: [today, ninetyDaysFromNow],
        },
      },
    });

    // Expired positions
    const expiredPositions = await this.leadershipAssignmentModel.count({
      where: {
        leadershipStatus: { [Op.in]: ['active', 'acting'] },
        endDate: {
          [Op.lt]: today,
        },
      },
    });

    // Vacant positions - count roles with no active assignments
    const allActiveRoles = await this.leadershipRoleTemplateModel.findAll({
      where: { status: 'active' },
      include: [
        {
          model: LeadershipAssignment,
          where: {
            leadershipStatus: { [Op.in]: ['active', 'acting'] },
          },
          required: false,
        },
      ],
    });

    const vacantPositions = allActiveRoles.filter(
      (role) => role.assignments.length === 0,
    ).length;

    return {
      totalActiveLeaders,
      rolesExpiringSoon,
      vacantPositions,
      expiredPositions,
    };
  }

  /**
   * Get all leadership roles
   */
  async getAllLeadershipRoles(
    category?: string,
  ): Promise<LeadershipRoleResponseDto[]> {
    const where: any = {};
    if (category) {
      where.category = category;
    }

    const roles = await this.leadershipRoleTemplateModel.findAll({
      where,
      include: [
        {
          model: LeadershipAssignment,
          where: {
            leadershipStatus: { [Op.in]: ['active', 'acting'] },
          },
          required: false,
          attributes: ['id'], // Only need ID for counting
        },
      ],
      order: [['name', 'ASC']],
    });

    return roles.map((role) => ({
      id: role.id,
      name: role.name,
      category: role.category,
      scopeType: role.scopeType,
      singleHolder: role.singleHolder,
      requiresTenure: role.requiresTenure,
      defaultTenureMonths: role.defaultTenureMonths || undefined,
      allowMultiRolePerMember: role.allowMultiRolePerMember,
      description: undefined, // Not in model - would need migration
      status: role.status,
      activeAssignments: role.assignments.length,
      createdAt: role.createdAt,
    }));
  }

  /**
   * Get leadership role by ID
   */
  async getLeadershipRoleById(id: string): Promise<LeadershipRoleResponseDto> {
    const role = await this.leadershipRoleTemplateModel.findByPk(id, {
      include: [
        {
          model: LeadershipAssignment,
          where: {
            leadershipStatus: {
              [Op.in]: ['active', 'acting', 'ended', 'inactive'],
            },
          },
          required: false,
          include: [
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
        },
      ],
    });

    if (!role) {
      throw new NotFoundException(`Leadership role with ID ${id} not found`);
    }

    // Pre-fetch scope names for assignments
    const scopeIds = role.assignments
      .map((a) => a.scopeId)
      .filter((id) => id) as string[];
    const uniqueScopeIds = [...new Set(scopeIds)];

    const bands = await this.bandModel.findAll({
      where: { id: { [Op.in]: uniqueScopeIds } },
      attributes: ['id', 'name'],
    });
    const units = await this.unitModel.findAll({
      where: { id: { [Op.in]: uniqueScopeIds } },
      attributes: ['id', 'name'],
    });
    const batches = await this.classBatchModel.findAll({
      where: { id: { [Op.in]: uniqueScopeIds } },
      attributes: ['id', 'batchCode'],
    });
    const departments = await this.departmentModel.findAll({
      where: { id: { [Op.in]: uniqueScopeIds } },
      attributes: ['id', 'name'],
    });
    const projects = await this.projectModel.findAll({
      where: { id: { [Op.in]: uniqueScopeIds } },
      attributes: ['id', 'name'],
    });

    const bandMap = new Map(bands.map((b) => [b.id, b.name]));
    const unitMap = new Map(units.map((u) => [u.id, u.name]));
    const batchMap = new Map(batches.map((b) => [b.id, b.batchCode]));
    const departmentMap = new Map(departments.map((d) => [d.id, d.name]));
    const projectMap = new Map(projects.map((p) => [p.id, p.name]));

    // Count only active and acting (exclude inactive and ended)
    const activeCount = role.assignments.filter(
      (a) => a.leadershipStatus === 'active' || a.leadershipStatus === 'acting',
    ).length;

    const assignments = role.assignments.map((assignment) => {
      const member = assignment.member;
      const memberName = [
        member?.firstName,
        member?.middleName,
        member?.surname,
      ]
        .filter(Boolean)
        .join(' ');

      // Get scope name
      let scopeName: string | undefined;
      if (assignment.scopeId) {
        switch (assignment.scopeEntity) {
          case 'BAND':
            scopeName = bandMap.get(assignment.scopeId);
            break;
          case 'UNIT':
            scopeName = unitMap.get(assignment.scopeId);
            break;
          case 'CLASS_BATCH':
            scopeName = batchMap.get(assignment.scopeId);
            break;
          case 'CHURCH':
            scopeName = 'Church Wide';
            break;
          case 'PROJECT':
            scopeName = projectMap.get(assignment.scopeId);
            break;
          case 'DEPARTMENT':
            scopeName = departmentMap.get(assignment.scopeId);
            break;
        }
      } else if (assignment.scopeEntity === 'CHURCH') {
        scopeName = 'Church Wide';
      }

      // Calculate days until expiry
      let daysUntilExpiry: number | undefined;
      if (assignment.endDate) {
        const endDate = new Date(assignment.endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diffTime = endDate.getTime() - today.getTime();
        daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }

      return {
        id: assignment.id,
        memberId: assignment.memberId,
        memberName: memberName || 'Unknown',
        memberEmail: member?.email || undefined,
        memberPhone: member?.phone || undefined,
        scopeEntity: assignment.scopeEntity,
        scopeId: assignment.scopeId || undefined,
        scopeName,
        startDate: assignment.startDate,
        endDate: assignment.endDate || undefined,
        status: assignment.leadershipStatus,
        daysUntilExpiry,
      };
    });

    return {
      id: role.id,
      name: role.name,
      category: role.category,
      scopeType: role.scopeType,
      singleHolder: role.singleHolder,
      requiresTenure: role.requiresTenure,
      defaultTenureMonths: role.defaultTenureMonths || undefined,
      allowMultiRolePerMember: role.allowMultiRolePerMember,
      description: undefined,
      status: role.status,
      activeAssignments: activeCount,
      assignments,
      createdAt: role.createdAt,
    };
  }

  /**
   * Create a new leadership role template
   */
  async createLeadershipRole(
    createDto: CreateLeadershipRoleDto,
  ): Promise<LeadershipRoleTemplate> {
    // Check if role name already exists
    const existing = await this.leadershipRoleTemplateModel.findOne({
      where: { name: createDto.name },
    });

    if (existing) {
      throw new BadRequestException(
        `Leadership role "${createDto.name}" already exists`,
      );
    }

    // Validate scope type and single holder
    if (createDto.scopeType === 'global' && !createDto.singleHolder) {
      throw new BadRequestException(
        'Global roles must have singleHolder set to true',
      );
    }

    return this.leadershipRoleTemplateModel.create({
      name: createDto.name,
      category: createDto.category,
      scopeType: createDto.scopeType,
      singleHolder: createDto.singleHolder ?? false,
      requiresTenure: createDto.requiresTenure ?? true,
      defaultTenureMonths: createDto.defaultTenureMonths || null,
      allowMultiRolePerMember: createDto.allowMultiRolePerMember ?? true,
      status: 'active',
    });
  }

  /**
   * Update a leadership role template
   */
  async updateLeadershipRole(
    id: string,
    updateDto: UpdateLeadershipRoleDto,
  ): Promise<LeadershipRoleTemplate> {
    const role = await this.leadershipRoleTemplateModel.findByPk(id);

    if (!role) {
      throw new NotFoundException(`Leadership role with ID ${id} not found`);
    }

    // Check if new name conflicts with existing role
    if (updateDto.name && updateDto.name !== role.name) {
      const existing = await this.leadershipRoleTemplateModel.findOne({
        where: { name: updateDto.name },
      });

      if (existing) {
        throw new BadRequestException(
          `Leadership role "${updateDto.name}" already exists`,
        );
      }
    }

    // Validate scope type and single holder
    const scopeType = updateDto.scopeType ?? role.scopeType;
    const singleHolder = updateDto.singleHolder ?? role.singleHolder;

    if (scopeType === 'global' && !singleHolder) {
      throw new BadRequestException(
        'Global roles must have singleHolder set to true',
      );
    }

    await role.update(updateDto);
    return role.reload();
  }

  /**
   * Delete a leadership role template (superadmin only)
   */
  async deleteLeadershipRole(id: string): Promise<void> {
    const role = await this.leadershipRoleTemplateModel.findByPk(id, {
      include: [{ model: LeadershipAssignment }],
    });

    if (!role) {
      throw new NotFoundException(`Leadership role with ID ${id} not found`);
    }

    // Check if role has active assignments
    const activeAssignments = role.assignments.filter(
      (a) => a.leadershipStatus === 'active' || a.leadershipStatus === 'acting',
    );

    if (activeAssignments.length > 0) {
      throw new BadRequestException(
        `Cannot delete role with ${activeAssignments.length} active assignment(s). Please end all assignments first.`,
      );
    }

    await role.destroy();
  }

  /**
   * Get all leadership assignments with filtering and pagination
   */
  async getAllLeadershipAssignments(queryDto: LeadershipQueryDto): Promise<{
    data: LeadershipAssignmentResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    const offset = (page - 1) * limit;

    const where: any = {};

    // Filter by scope entity
    if (queryDto.scopeEntity) {
      where.scopeEntity = queryDto.scopeEntity;
    }

    // Filter by scope ID
    if (queryDto.scopeId) {
      where.scopeId = queryDto.scopeId;
    }

    // Filter by leadership status
    if (queryDto.leadershipStatus) {
      where.leadershipStatus = queryDto.leadershipStatus;
    }

    // Build include conditions
    const templateInclude: any = {
      model: LeadershipRoleTemplate,
      attributes: [
        'id',
        'name',
        'category',
        'scopeType',
        'singleHolder',
        'requiresTenure',
        'defaultTenureMonths',
        'allowMultiRolePerMember',
        'status',
        'createdAt',
      ],
    };

    // Filter by category
    if (queryDto.category) {
      templateInclude.where = { category: queryDto.category };
    }

    const memberInclude: any = {
      model: Member,
      attributes: [
        'id',
        'firstName',
        'middleName',
        'surname',
        'email',
        'phone',
      ],
    };

    // Note: Search will be handled after fetching to allow searching across both role and member names

    const { count, rows: assignments } =
      await this.leadershipAssignmentModel.findAndCountAll({
        where,
        include: [templateInclude, memberInclude],
        limit,
        offset,
        order: [['startDate', 'DESC']],
        distinct: true, // Important for count with includes
      });

    // Pre-fetch scope names to avoid N+1 queries
    const scopeIds = assignments
      .map((a) => a.scopeId)
      .filter((id) => id) as string[];
    const uniqueScopeIds = [...new Set(scopeIds)];

    const bands = await this.bandModel.findAll({
      where: { id: { [Op.in]: uniqueScopeIds } },
      attributes: ['id', 'name'],
    });
    const units = await this.unitModel.findAll({
      where: { id: { [Op.in]: uniqueScopeIds } },
      attributes: ['id', 'name'],
    });
    const batches = await this.classBatchModel.findAll({
      where: { id: { [Op.in]: uniqueScopeIds } },
      attributes: ['id', 'batchCode'],
    });
    const departments = await this.departmentModel.findAll({
      where: { id: { [Op.in]: uniqueScopeIds } },
      attributes: ['id', 'name'],
    });
    const projects = await this.projectModel.findAll({
      where: { id: { [Op.in]: uniqueScopeIds } },
      attributes: ['id', 'name'],
    });

    const bandMap = new Map(bands.map((b) => [b.id, b.name]));
    const unitMap = new Map(units.map((u) => [u.id, u.name]));
    const batchMap = new Map(batches.map((b) => [b.id, b.batchCode]));
    const departmentMap = new Map(departments.map((d) => [d.id, d.name]));
    const projectMap = new Map(projects.map((p) => [p.id, p.name]));

    // Map assignments to response DTOs
    const data = await Promise.all(
      assignments.map(async (assignment) => {
        // Skip if template or member is missing (from filtering)
        if (!assignment.template || !assignment.member) {
          return null;
        }

        // Filter by category if specified
        if (
          queryDto.category &&
          assignment.template.category !== queryDto.category
        ) {
          return null;
        }

        const member = assignment.member;
        const memberName = [member.firstName, member.middleName, member.surname]
          .filter(Boolean)
          .join(' ');

        // Get scope name
        let scopeName: string | undefined;
        if (assignment.scopeId) {
          switch (assignment.scopeEntity) {
            case 'BAND':
              scopeName = bandMap.get(assignment.scopeId);
              break;
            case 'UNIT':
              scopeName = unitMap.get(assignment.scopeId);
              break;
            case 'CLASS_BATCH':
              scopeName = batchMap.get(assignment.scopeId);
              break;
            case 'CHURCH':
              scopeName = 'Church Wide';
              break;
            case 'PROJECT':
              scopeName = projectMap.get(assignment.scopeId);
              break;
            case 'DEPARTMENT':
              scopeName = departmentMap.get(assignment.scopeId);
              break;
          }
        }

        // Search filter - check role name, member name, or scope name
        if (queryDto.search) {
          const searchLower = queryDto.search.toLowerCase();
          const roleNameMatch = assignment.template.name
            .toLowerCase()
            .includes(searchLower);
          const memberNameMatch = memberName
            .toLowerCase()
            .includes(searchLower);
          const scopeNameMatch =
            scopeName?.toLowerCase().includes(searchLower) || false;

          if (!roleNameMatch && !memberNameMatch && !scopeNameMatch) {
            return null;
          }
        }

        // Calculate status badge
        const statusBadge = this.calculateStatusBadge(assignment);

        // Calculate days until expiry
        let daysUntilExpiry: number | undefined;
        if (assignment.endDate) {
          const endDate = new Date(assignment.endDate);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const diffTime = endDate.getTime() - today.getTime();
          daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        // Filter by status badge if specified
        if (queryDto.statusBadge && statusBadge !== queryDto.statusBadge) {
          return null;
        }

        return {
          id: assignment.id,
          role: {
            id: assignment.template.id,
            name: assignment.template.name,
            category: assignment.template.category,
            scopeType: assignment.template.scopeType,
            singleHolder: assignment.template.singleHolder,
            requiresTenure: assignment.template.requiresTenure,
            defaultTenureMonths:
              assignment.template.defaultTenureMonths || undefined,
            allowMultiRolePerMember:
              assignment.template.allowMultiRolePerMember,
            description: undefined,
            status: assignment.template.status,
            activeAssignments: 0, // Would need to calculate
            assignments: [], // Not needed in assignment response
            createdAt: assignment.template.createdAt,
          },
          memberId: member.id,
          memberName: memberName || 'Unknown',
          memberEmail: member.email || undefined,
          memberPhone: member.phone || undefined,
          scopeEntity: assignment.scopeEntity,
          scopeId: assignment.scopeId || undefined,
          scopeName,
          startDate: assignment.startDate,
          endDate: assignment.endDate || undefined,
          leadershipStatus: assignment.leadershipStatus,
          endReason: assignment.endReason || undefined,
          daysUntilExpiry,
          statusBadge,
          createdAt: assignment.createdAt,
        };
      }),
    );

    // Filter out null values (from statusBadge filter)
    const filteredData = data.filter(
      (item) => item !== null,
    ) as LeadershipAssignmentResponseDto[];

    return {
      data: filteredData,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  /**
   * Get leadership assignment by ID
   */
  async getLeadershipAssignmentById(
    id: string,
  ): Promise<LeadershipAssignmentResponseDto> {
    const assignment = await this.leadershipAssignmentModel.findByPk(id, {
      include: [
        {
          model: LeadershipRoleTemplate,
        },
        {
          model: Member,
        },
      ],
    });

    if (!assignment) {
      throw new NotFoundException(
        `Leadership assignment with ID ${id} not found`,
      );
    }

    const member = assignment.member;
    const memberName = [member.firstName, member.middleName, member.surname]
      .filter(Boolean)
      .join(' ');

    // Get scope name
    let scopeName: string | undefined;
    if (assignment.scopeId) {
      switch (assignment.scopeEntity) {
        case 'BAND':
          const band = await this.bandModel.findByPk(assignment.scopeId);
          scopeName = band?.name;
          break;
        case 'UNIT':
          const unit = await this.unitModel.findByPk(assignment.scopeId);
          scopeName = unit?.name;
          break;
        case 'CLASS_BATCH':
          const batch = await this.classBatchModel.findByPk(assignment.scopeId);
          scopeName = batch?.batchCode;
          break;
        case 'CHURCH':
          scopeName = 'Church Wide';
          break;
        case 'PROJECT':
          const proj = await this.projectModel.findByPk(assignment.scopeId);
          scopeName = proj?.name;
          break;
        case 'DEPARTMENT':
          const department = await this.departmentModel.findByPk(
            assignment.scopeId,
          );
          scopeName = department?.name;
          break;
      }
    }

    const statusBadge = this.calculateStatusBadge(assignment);

    let daysUntilExpiry: number | undefined;
    if (assignment.endDate) {
      const endDate = new Date(assignment.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const diffTime = endDate.getTime() - today.getTime();
      daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    return {
      id: assignment.id,
      role: {
        id: assignment.template.id,
        name: assignment.template.name,
        category: assignment.template.category,
        scopeType: assignment.template.scopeType,
        singleHolder: assignment.template.singleHolder,
        requiresTenure: assignment.template.requiresTenure,
        defaultTenureMonths:
          assignment.template.defaultTenureMonths || undefined,
        allowMultiRolePerMember: assignment.template.allowMultiRolePerMember,
        description: undefined,
        status: assignment.template.status,
        activeAssignments: 0,
        assignments: [], // Not needed in assignment response
        createdAt: assignment.template.createdAt,
      },
      memberId: member.id,
      memberName: memberName || 'Unknown',
      memberEmail: member.email || undefined,
      memberPhone: member.phone || undefined,
      scopeEntity: assignment.scopeEntity,
      scopeId: assignment.scopeId || undefined,
      scopeName,
      startDate: assignment.startDate,
      endDate: assignment.endDate || undefined,
      leadershipStatus: assignment.leadershipStatus,
      endReason: assignment.endReason || undefined,
      daysUntilExpiry,
      statusBadge,
      createdAt: assignment.createdAt,
    };
  }

  /**
   * Assign a leadership role to a member
   */
  async assignLeadership(
    assignDto: AssignLeadershipDto,
  ): Promise<LeadershipAssignment> {
    // Verify role template exists
    const roleTemplate = await this.leadershipRoleTemplateModel.findByPk(
      assignDto.roleTemplateId,
    );

    if (!roleTemplate) {
      throw new NotFoundException(
        `Leadership role template with ID ${assignDto.roleTemplateId} not found`,
      );
    }

    if (roleTemplate.status !== 'active') {
      throw new BadRequestException('Cannot assign inactive role template');
    }

    // Verify member exists
    const member = await this.memberModel.findByPk(assignDto.memberId);

    if (!member) {
      throw new NotFoundException(
        `Member with ID ${assignDto.memberId} not found`,
      );
    }

    // Validate scope for contextual roles
    if (roleTemplate.scopeType === 'contextual' && !assignDto.scopeId) {
      throw new BadRequestException(
        'Contextual roles require a scopeId (band ID, unit ID, etc.)',
      );
    }

    // For global roles, scopeId should be null
    if (roleTemplate.scopeType === 'global' && assignDto.scopeId) {
      throw new BadRequestException('Global roles should not have a scopeId');
    }

    // Validate scope entity matches role category
    const categoryToScopeMap: Record<string, string> = {
      SIC: 'CHURCH',
      BAND: 'BAND',
      UNIT: 'UNIT',
      CLASS: 'CLASS_BATCH',
      COMMITTEE: 'PROJECT',
      DEPARTMENT: 'DEPARTMENT',
    };

    const expectedScopeEntity = categoryToScopeMap[roleTemplate.category];
    if (assignDto.scopeEntity !== expectedScopeEntity) {
      throw new BadRequestException(
        `Role category ${roleTemplate.category} requires scopeEntity ${expectedScopeEntity}, but got ${assignDto.scopeEntity}`,
      );
    }

    // Verify scope exists if provided
    if (assignDto.scopeId) {
      let scopeExists = false;
      switch (assignDto.scopeEntity) {
        case 'BAND':
          const band = await this.bandModel.findByPk(assignDto.scopeId);
          scopeExists = !!band;
          break;
        case 'UNIT':
          const unit = await this.unitModel.findByPk(assignDto.scopeId);
          scopeExists = !!unit;
          break;
        case 'CLASS_BATCH':
          const batch = await this.classBatchModel.findByPk(assignDto.scopeId);
          scopeExists = !!batch;
          break;
        case 'CHURCH':
          scopeExists = true; // Always exists
          break;
        case 'PROJECT':
          const project = await this.projectModel.findByPk(assignDto.scopeId);
          scopeExists = !!project;
          break;
        case 'DEPARTMENT':
          const dept = await this.departmentModel.findByPk(assignDto.scopeId);
          scopeExists = !!dept;
          break;
      }

      if (!scopeExists) {
        throw new NotFoundException(
          `${assignDto.scopeEntity} with ID ${assignDto.scopeId} not found`,
        );
      }
    }

    // Check for single holder: global roles = one holder system-wide; contextual = one holder per scope
    if (roleTemplate.singleHolder) {
      if (roleTemplate.scopeType === 'global') {
        const existingActive = await this.leadershipAssignmentModel.findOne({
          where: {
            templateId: roleTemplate.id,
            leadershipStatus: { [Op.in]: ['active', 'acting'] },
          },
        });
        if (existingActive) {
          throw new BadRequestException(
            `Role "${roleTemplate.name}" can only have one active holder. Please end the current assignment first.`,
          );
        }
      } else if (
        roleTemplate.scopeType === 'contextual' &&
        assignDto.scopeId
      ) {
        const existingInScope = await this.leadershipAssignmentModel.findOne({
          where: {
            templateId: roleTemplate.id,
            scopeEntity: assignDto.scopeEntity,
            scopeId: assignDto.scopeId,
            leadershipStatus: { [Op.in]: ['active', 'acting'] },
          },
        });
        if (existingInScope) {
          throw new BadRequestException(
            `Role "${roleTemplate.name}" already has an active holder for this committee/project.`,
          );
        }
      }
    }

    // Check if member can hold multiple roles
    if (!roleTemplate.allowMultiRolePerMember) {
      const existingRole = await this.leadershipAssignmentModel.findOne({
        where: {
          templateId: roleTemplate.id,
          memberId: assignDto.memberId,
          leadershipStatus: { [Op.in]: ['active', 'acting'] },
        },
      });

      if (existingRole) {
        throw new BadRequestException(
          `Member already holds this role. This role does not allow multiple assignments per member.`,
        );
      }
    }

    // Calculate dates
    const startDate = assignDto.startDate
      ? new Date(assignDto.startDate)
      : new Date();

    let endDate: Date | null = null;
    if (assignDto.endDate) {
      endDate = new Date(assignDto.endDate);
    } else if (
      roleTemplate.requiresTenure &&
      roleTemplate.defaultTenureMonths
    ) {
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + roleTemplate.defaultTenureMonths);
    }

    // Create assignment
    return this.leadershipAssignmentModel.create({
      templateId: roleTemplate.id,
      memberId: assignDto.memberId,
      scopeEntity: assignDto.scopeEntity,
      scopeId: assignDto.scopeId || null,
      startDate,
      endDate,
      leadershipStatus: 'active',
    });
  }

  /**
   * Update a leadership assignment
   */
  async updateLeadershipAssignment(
    id: string,
    updateDto: UpdateLeadershipAssignmentDto,
  ): Promise<LeadershipAssignment> {
    const assignment = await this.leadershipAssignmentModel.findByPk(id, {
      include: [{ model: LeadershipRoleTemplate, as: 'template' }],
    });

    if (!assignment) {
      throw new NotFoundException(
        `Leadership assignment with ID ${id} not found`,
      );
    }

    // If reassigning member, verify new member exists
    if (updateDto.memberId && updateDto.memberId !== assignment.memberId) {
      const member = await this.memberModel.findByPk(updateDto.memberId);
      if (!member) {
        throw new NotFoundException(
          `Member with ID ${updateDto.memberId} not found`,
        );
      }

      // Check single holder constraint if applicable
      if (assignment.template.singleHolder) {
        const existingActive = await this.leadershipAssignmentModel.findOne({
          where: {
            templateId: assignment.templateId,
            memberId: updateDto.memberId,
            leadershipStatus: { [Op.in]: ['active', 'acting'] },
            id: { [Op.ne]: id },
          },
        });

        if (existingActive) {
          throw new BadRequestException(
            `Member already holds this role. This role can only have one holder.`,
          );
        }
      }
    }

    const updateData: any = {};

    if (updateDto.memberId) {
      updateData.memberId = updateDto.memberId;
    }

    if (updateDto.startDate) {
      updateData.startDate = new Date(updateDto.startDate);
    }

    if (updateDto.endDate) {
      updateData.endDate = new Date(updateDto.endDate);
    }

    if (updateDto.leadershipStatus) {
      updateData.leadershipStatus = updateDto.leadershipStatus;
    }

    if (updateDto.endReason) {
      updateData.endReason = updateDto.endReason;
    }

    await assignment.update(updateData);
    return assignment.reload();
  }

  /**
   * Delete a leadership assignment (superadmin only)
   */
  async deleteLeadershipAssignment(id: string): Promise<void> {
    const assignment = await this.leadershipAssignmentModel.findByPk(id);

    if (!assignment) {
      throw new NotFoundException(
        `Leadership assignment with ID ${id} not found`,
      );
    }

    await assignment.destroy();
  }

  /**
   * Export leadership assignments to CSV
   */
  async exportLeadershipAssignments(
    queryDto: LeadershipQueryDto,
  ): Promise<string> {
    // Get all assignments (no pagination for export)
    const allQueryDto = { ...queryDto, page: 1, limit: 10000 };
    const result = await this.getAllLeadershipAssignments(allQueryDto);

    // Convert to CSV format
    const headers = [
      'Role Name',
      'Category',
      'Member Name',
      'Email',
      'Phone',
      'Scope Entity',
      'Scope Name',
      'Start Date',
      'End Date',
      'Status',
      'Days Until Expiry',
    ];

    const rows = result.data.map((assignment) => [
      assignment.role.name,
      assignment.role.category,
      assignment.memberName,
      assignment.memberEmail || '',
      assignment.memberPhone || '',
      assignment.scopeEntity,
      assignment.scopeName || '',
      assignment.startDate.toISOString().split('T')[0],
      assignment.endDate ? assignment.endDate.toISOString().split('T')[0] : '',
      assignment.statusBadge,
      assignment.daysUntilExpiry?.toString() || '',
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    return csvContent;
  }

  /**
   * Calculate status badge for an assignment
   * Active: Currently active and not expiring soon
   * Due: Expiring within 90 days
   * Expired: Past end date
   * Vacant: No assignment (handled separately)
   */
  private calculateStatusBadge(
    assignment: LeadershipAssignment,
  ): 'Active' | 'Due' | 'Expired' | 'Vacant' | 'Inactive' {
    // Handle inactive status first
    if (assignment.leadershipStatus === 'inactive') {
      return 'Inactive';
    }

    if (assignment.leadershipStatus === 'ended') {
      return 'Expired';
    }

    if (!assignment.endDate) {
      return 'Active';
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(assignment.endDate);
    const ninetyDaysFromNow = new Date(today);
    ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);

    if (endDate < today) {
      return 'Expired';
    }

    if (endDate <= ninetyDaysFromNow) {
      return 'Due';
    }

    return 'Active';
  }

  /**
   * Calculate age from date of birth
   */
  private calculateAge(dob: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }
}
