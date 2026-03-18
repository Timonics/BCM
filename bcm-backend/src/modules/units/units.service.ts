import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Unit } from '../../database/models/unit.model';
import { UnitMembership } from '../../database/models/unit-membership.model';
import { Member } from '../../database/models/member.model';
import { LeadershipAssignment } from '../../database/models/leadership-assignment.model';
import { LeadershipRoleTemplate } from '../../database/models/leadership-role-template.model';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { AddUnitMemberDto } from './dto/add-unit-member.dto';
import { AssignUnitLeadershipDto } from './dto/assign-unit-leadership.dto';

/**
 * Units Service
 * Handles unit management, member assignments, and leadership assignments
 */
@Injectable()
export class UnitsService {
  constructor(
    @InjectModel(Unit)
    private unitModel: typeof Unit,
    @InjectModel(UnitMembership)
    private unitMembershipModel: typeof UnitMembership,
    @InjectModel(Member)
    private memberModel: typeof Member,
    @InjectModel(LeadershipAssignment)
    private leadershipAssignmentModel: typeof LeadershipAssignment,
    @InjectModel(LeadershipRoleTemplate)
    private leadershipRoleTemplateModel: typeof LeadershipRoleTemplate,
  ) {}

  /**
   * Create a new unit
   */
  async createUnit(createUnitDto: CreateUnitDto): Promise<Unit> {
    // Check if unit name already exists
    const existing = await this.unitModel.findOne({
      where: { name: createUnitDto.name },
    });
    if (existing) {
      throw new BadRequestException('Unit name already exists');
    }

    const createData: any = { ...createUnitDto };
    // Convert foundedDate string to Date if provided
    if (createData.foundedDate && typeof createData.foundedDate === 'string') {
      createData.foundedDate = new Date(createData.foundedDate);
    }

    return this.unitModel.create(createData);
  }

  /**
   * Get all units with overview statistics
   * Returns summary: total members, active members, inactive members, coordinator
   */
  async getAllUnits(search?: string) {
    const where: any = { status: 'active' };

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { code: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const units = await this.unitModel.findAll({
      where,
      order: [['name', 'ASC']],
    });

    // Get overview statistics for each unit
    const unitsWithOverview = await Promise.all(
      units.map(async (unit) => {
        // Get all memberships with member data
        const memberships = await this.unitMembershipModel.findAll({
          where: { unitId: unit.id },
          include: [
            {
              model: Member,
              as: 'member',
              attributes: ['id'],
            },
          ],
        });

        const totalMembers = memberships.length;
        const activeMembers = memberships.filter((m) => m.isActive).length;
        const inactiveMembers = totalMembers - activeMembers;

        // Find coordinator (Head of Unit role)
        const coordinatorRole = await this.leadershipRoleTemplateModel.findOne({
          where: {
            name: { [Op.iLike]: '%head of unit%' },
            category: 'UNIT',
          },
        });

        let coordinator: string | undefined;
        if (coordinatorRole) {
          const coordinatorAssignment =
            await this.leadershipAssignmentModel.findOne({
              where: {
                templateId: coordinatorRole.id,
                scopeEntity: 'UNIT',
                scopeId: unit.id,
                leadershipStatus: 'active',
              },
              include: [
                {
                  model: Member,
                  as: 'member',
                  attributes: ['firstName', 'middleName', 'surname'],
                },
              ],
            });

          if (coordinatorAssignment?.member) {
            const member = coordinatorAssignment.member;
            const name = [member.firstName, member.middleName, member.surname]
              .filter(Boolean)
              .join(' ');
            coordinator = name || undefined;
          }
        }

        return {
          id: unit.id,
          name: unit.name,
          code: unit.code,
          description: unit.description,
          status: unit.status,
          totalMembers,
          activeMembers,
          inactiveMembers,
          coordinator,
          updatedAt: unit.updatedAt,
        };
      }),
    );

    return unitsWithOverview;
  }

  /**
   * Get units overview statistics
   */
  async getUnitsOverview() {
    const totalUnits = await this.unitModel.count({
      where: { status: 'active' },
    });

    // Count total unique members across all units
    const totalMembers = await this.unitMembershipModel.count({
      distinct: true,
      col: 'member_id',
    });

    // Count leadership alerts (expiring or expired roles)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringAssignments = await this.leadershipAssignmentModel.count({
      where: {
        scopeEntity: 'UNIT',
        leadershipStatus: 'active',
        endDate: {
          [Op.between]: [today, thirtyDaysFromNow],
        },
      },
    });

    const expiredAssignments = await this.leadershipAssignmentModel.count({
      where: {
        scopeEntity: 'UNIT',
        leadershipStatus: 'active',
        endDate: {
          [Op.lt]: today,
        },
      },
    });

    const leadershipAlerts = expiringAssignments + expiredAssignments;

    const activeUnits = totalUnits;

    return {
      totalUnits,
      totalMembers,
      leadershipAlerts,
      activeUnits,
    };
  }

  /**
   * Get unit by ID
   */
  async getUnitById(id: string): Promise<Unit> {
    const unit = await this.unitModel.findByPk(id);

    if (!unit) {
      throw new NotFoundException(`Unit with ID ${id} not found`);
    }

    return unit;
  }

  /**
   * Get unit details with coordinator information and statistics
   */
  async getUnitDetails(id: string) {
    const unit = await this.getUnitById(id);

    // Find coordinator (Head of Unit role)
    const coordinatorRole = await this.leadershipRoleTemplateModel.findOne({
      where: {
        name: { [Op.iLike]: '%head of unit%' },
        category: 'UNIT',
      },
    });

    let coordinator = null;
    if (coordinatorRole) {
      const coordinatorAssignment =
        await this.leadershipAssignmentModel.findOne({
          where: {
            templateId: coordinatorRole.id,
            scopeEntity: 'UNIT',
            scopeId: unit.id,
            leadershipStatus: 'active',
          },
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
        });

      if (coordinatorAssignment?.member) {
        const member = coordinatorAssignment.member;
        const name = [member.firstName, member.middleName, member.surname]
          .filter(Boolean)
          .join(' ');
        coordinator = {
          name: name || 'Unknown',
          email: member.email,
          phone: member.phone,
        };
      }
    }

    // Count members
    const allMemberships = await this.unitMembershipModel.findAll({
      where: { unitId: unit.id },
    });

    const totalMembers = allMemberships.length;
    const activeMembers = allMemberships.filter((m) => m.isActive).length;
    const inactiveMembers = totalMembers - activeMembers;

    // Count leadership alerts (expiring or expired roles)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringAssignments = await this.leadershipAssignmentModel.count({
      where: {
        scopeEntity: 'UNIT',
        scopeId: unit.id,
        leadershipStatus: 'active',
        endDate: {
          [Op.between]: [today, thirtyDaysFromNow],
        },
      },
    });

    const expiredAssignments = await this.leadershipAssignmentModel.count({
      where: {
        scopeEntity: 'UNIT',
        scopeId: unit.id,
        leadershipStatus: 'active',
        endDate: {
          [Op.lt]: today,
        },
      },
    });

    const leadershipAlerts = expiringAssignments + expiredAssignments;

    return {
      id: unit.id,
      name: unit.name,
      code: unit.code,
      description: unit.description,
      status: unit.status,
      coordinator: coordinator || undefined,
      foundedDate: unit.foundedDate || undefined,
      meetingScheduleDay: unit.meetingScheduleDay || undefined,
      meetingScheduleTime: unit.meetingScheduleTime || undefined,
      totalMembers,
      activeMembers,
      inactiveMembers,
      leadershipAlerts,
      updatedAt: unit.updatedAt,
    };
  }

  /**
   * Get unit leadership team
   */
  async getUnitLeadershipTeam(unitId: string) {
    // Verify unit exists
    await this.getUnitById(unitId);

    const assignments = await this.leadershipAssignmentModel.findAll({
      where: {
        scopeEntity: 'UNIT',
        scopeId: unitId,
        leadershipStatus: { [Op.in]: ['active', 'acting'] },
      },
      include: [
        {
          model: LeadershipRoleTemplate,
          as: 'template',
          attributes: ['id', 'name'],
        },
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return assignments.map((assignment) => {
      const member = assignment.member;
      const name = [member.firstName, member.middleName, member.surname]
        .filter(Boolean)
        .join(' ');

      let daysRemaining: number | undefined;
      if (assignment.endDate && assignment.leadershipStatus === 'active') {
        const endDate = new Date(assignment.endDate);
        endDate.setHours(0, 0, 0, 0);
        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        daysRemaining = diffDays > 0 ? diffDays : undefined;
      }

      return {
        id: assignment.id,
        name: name || 'Unknown',
        role: assignment.template?.name || 'Unknown Role',
        startDate: assignment.startDate,
        endDate: assignment.endDate || undefined,
        email: member.email,
        phone: member.phone,
        status: assignment.leadershipStatus,
        daysRemaining,
      };
    });
  }

  /**
   * Get unit members with detailed information
   */
  async getUnitMembers(unitId: string) {
    // Verify unit exists
    await this.getUnitById(unitId);

    const memberships = await this.unitMembershipModel.findAll({
      where: { unitId: unitId },
      include: [
        {
          model: Member,
          as: 'member',
          attributes: [
            'id',
            'firstName',
            'middleName',
            'surname',
            'gender',
            'dob',
            'email',
            'phone',
            'suspensionStatus',
          ],
        },
      ],
      order: [['startDate', 'ASC']],
    });

    return memberships.map((membership) => {
      const member = membership.member;
      const name = [member.firstName, member.middleName, member.surname]
        .filter(Boolean)
        .join(' ');

      // Calculate age
      let age: number | undefined;
      if (member.dob) {
        age = this.calculateAge(member.dob);
      }

      return {
        id: member.id,
        name: name || 'Unknown',
        gender: member.gender,
        age,
        email: member.email,
        phone: member.phone,
        joinDate: membership.startDate,
        attendance: null, // Attendance tracking not yet implemented
        status:
          membership.isActive && member.suspensionStatus === 'active'
            ? 'active'
            : 'inactive',
      };
    });
  }

  /**
   * Update unit
   */
  async updateUnit(id: string, updateUnitDto: UpdateUnitDto): Promise<Unit> {
    const unit = await this.getUnitById(id);
    const updateData: any = { ...updateUnitDto };
    // Convert foundedDate string to Date if provided
    if (updateData.foundedDate && typeof updateData.foundedDate === 'string') {
      updateData.foundedDate = new Date(updateData.foundedDate);
    }
    await unit.update(updateData);
    return unit.reload();
  }

  /**
   * Delete unit (archive) - superadmin only
   */
  async deleteUnit(id: string): Promise<void> {
    const unit = await this.getUnitById(id);
    await unit.update({ status: 'archived' });
  }

  /**
   * Add member to unit
   * Note: Members can belong to multiple units simultaneously (unlike bands)
   */
  async addMemberToUnit(unitId: string, addMemberDto: AddUnitMemberDto) {
    await this.getUnitById(unitId);
    const member = await this.memberModel.findByPk(addMemberDto.memberId);
    if (!member) {
      throw new NotFoundException('Member not found');
    }

    // Check if member is already in this unit
    const existingInThisUnit = await this.unitMembershipModel.findOne({
      where: {
        memberId: addMemberDto.memberId,
        unitId: unitId,
        isActive: true,
      },
    });

    if (existingInThisUnit) {
      throw new BadRequestException(
        'This member has already been assigned to this unit',
      );
    }

    // Note: Unlike bands, members can belong to multiple units simultaneously
    // So we don't need to deactivate other unit memberships

    // Create new membership
    const startDate = addMemberDto.startDate
      ? new Date(addMemberDto.startDate)
      : new Date();

    return this.unitMembershipModel.create({
      unitId,
      memberId: addMemberDto.memberId,
      startDate,
      isActive: true,
    });
  }

  /**
   * Remove member from unit
   * Deactivates the membership by setting isActive to false
   */
  async removeMemberFromUnit(
    unitId: string,
    memberId: string,
  ): Promise<{ message: string }> {
    const unit = await this.getUnitById(unitId);
    const member = await this.memberModel.findByPk(memberId);

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    const membership = await this.unitMembershipModel.findOne({
      where: {
        unitId: unit.id,
        memberId: memberId,
        isActive: true,
      },
    });

    if (!membership) {
      throw new NotFoundException(
        `Member is not currently active in this unit`,
      );
    }

    // Deactivate membership
    await membership.update({
      isActive: false,
      endDate: new Date(),
      exitReason: 'removed',
    });

    return {
      message: 'Member removed from unit successfully',
    };
  }

  /**
   * Assign unit leadership role
   * Roles: Head of Unit, Assistant Head, Secretary
   * Default tenure: 2 years (can be customized)
   */
  async assignUnitLeadership(
    unitId: string,
    assignDto: AssignUnitLeadershipDto,
  ): Promise<LeadershipAssignment> {
    // Verify unit exists
    await this.getUnitById(unitId);
    const member = await this.memberModel.findByPk(assignDto.memberId);
    if (!member) {
      throw new NotFoundException('Member not found');
    }

    // Verify member is in the unit
    const unitMembership = await this.unitMembershipModel.findOne({
      where: {
        unitId: unitId,
        memberId: assignDto.memberId,
        isActive: true,
      },
    });

    if (!unitMembership) {
      throw new BadRequestException(
        'Member must be an active member of the unit before being assigned a leadership role',
      );
    }

    // Find or create leadership role template
    // Handle role name formatting (e.g., 'head_of_unit' -> 'Head of Unit', 'assistant_head' -> 'Assistant Head')
    const roleNameFormatted = assignDto.role
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    let roleTemplate = await this.leadershipRoleTemplateModel.findOne({
      where: {
        name: roleNameFormatted,
        category: 'UNIT',
      },
    });

    if (!roleTemplate) {
      roleTemplate = await this.leadershipRoleTemplateModel.create({
        name: roleNameFormatted,
        category: 'UNIT',
        scopeType: 'contextual',
        requiresTenure: true,
        defaultTenureMonths: 24, // 2 years
      });
    }

    // Calculate end date (2 years from start if not provided)
    const startDate = assignDto.startDate
      ? new Date(assignDto.startDate)
      : new Date();
    const endDate = assignDto.endDate
      ? new Date(assignDto.endDate)
      : new Date(
          startDate.getFullYear() + 2,
          startDate.getMonth(),
          startDate.getDate(),
        );

    // Check if there's an existing active assignment for this role
    const existing = await this.leadershipAssignmentModel.findOne({
      where: {
        templateId: roleTemplate.id,
        scopeEntity: 'UNIT',
        scopeId: unitId,
        leadershipStatus: 'active',
      },
    });

    if (existing) {
      // End previous assignment
      await existing.update({
        leadershipStatus: 'ended',
        endDate: new Date(),
        endReason: 'replaced',
      });
    }

    // Create new assignment
    return this.leadershipAssignmentModel.create({
      templateId: roleTemplate.id,
      memberId: assignDto.memberId,
      scopeEntity: 'UNIT',
      scopeId: unitId,
      startDate,
      endDate,
      leadershipStatus: 'active',
    });
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
}
