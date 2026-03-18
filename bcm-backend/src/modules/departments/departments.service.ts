import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Department } from '../../database/models/department.model';
import { Unit } from '../../database/models/unit.model';
import { UnitMembership } from '../../database/models/unit-membership.model';
import { Member } from '../../database/models/member.model';
import { LeadershipAssignment } from '../../database/models/leadership-assignment.model';
import { LeadershipRoleTemplate } from '../../database/models/leadership-role-template.model';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { AddDepartmentMemberDto } from './dto/add-department-member.dto';
import { CreateUnitDto } from '../units/dto/create-unit.dto';

/**
 * Departments Service
 * Handles department CRUD, overview/detail stats, units, members, leadership, add member, add unit
 */
@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department)
    private departmentModel: typeof Department,
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

  private calculateAge(dob: Date): number {
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  }

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const existing = await this.departmentModel.findOne({
      where: { name: createDepartmentDto.name },
    });
    if (existing) {
      throw new BadRequestException('Department name already exists');
    }

    const data: any = { ...createDepartmentDto };
    if (data.foundedDate && typeof data.foundedDate === 'string') {
      data.foundedDate = new Date(data.foundedDate);
    }
    return this.departmentModel.create(data);
  }

  async findAll(search?: string) {
    const where: any = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const departments = await this.departmentModel.findAll({
      where,
      include: [
        {
          model: Member,
          as: 'headOfDepartment',
          attributes: ['id', 'firstName', 'middleName', 'surname'],
          required: false,
        },
      ],
      order: [['name', 'ASC']],
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const result = await Promise.all(
      departments.map(async (dept) => {
        const units = await this.unitModel.findAll({
          where: { departmentId: dept.id },
          attributes: ['id'],
        });
        const unitIds = units.map((u) => u.id);

        let totalMembers = 0;
        let leadershipAlerts = 0;

        if (unitIds.length > 0) {
          const memberships = await this.unitMembershipModel.count({
            where: { unitId: { [Op.in]: unitIds }, isActive: true },
            distinct: true,
            col: 'member_id',
          });
          totalMembers = memberships;

          const expiring = await this.leadershipAssignmentModel.count({
            where: {
              scopeEntity: 'DEPARTMENT',
              scopeId: dept.id,
              leadershipStatus: 'active',
              endDate: {
                [Op.between]: [today, thirtyDaysFromNow],
              },
            },
          });
          const expired = await this.leadershipAssignmentModel.count({
            where: {
              scopeEntity: 'DEPARTMENT',
              scopeId: dept.id,
              leadershipStatus: 'active',
              endDate: { [Op.lt]: today },
            },
          });
          leadershipAlerts = expiring + expired;
        }

        let headName =
          dept.headOfDepartment &&
          [
            dept.headOfDepartment.firstName,
            dept.headOfDepartment.middleName,
            dept.headOfDepartment.surname,
          ]
            .filter(Boolean)
            .join(' ');

        // If no head from department field, use "Head of Department" assignment
        if (!headName) {
          const headRole = await this.leadershipRoleTemplateModel.findOne({
            where: {
              name: { [Op.iLike]: '%head of department%' },
              category: 'DEPARTMENT',
            },
          });
          if (headRole) {
            const headAssignment = await this.leadershipAssignmentModel.findOne(
              {
                where: {
                  templateId: headRole.id,
                  scopeEntity: 'DEPARTMENT',
                  scopeId: dept.id,
                  leadershipStatus: { [Op.in]: ['active', 'acting'] },
                },
                include: [
                  {
                    model: Member,
                    as: 'member',
                    attributes: ['firstName', 'middleName', 'surname'],
                  },
                ],
              },
            );
            if (headAssignment?.member) {
              const m = (headAssignment as any).member;
              headName = [m.firstName, m.middleName, m.surname]
                .filter(Boolean)
                .join(' ');
            }
          }
        }

        return {
          id: dept.id,
          name: dept.name,
          category: dept.category,
          description: dept.description,
          status: dept.status,
          totalMembers,
          unitsCount: units.length,
          headOfDepartment: headName || undefined,
          leadershipAlerts: leadershipAlerts > 0 ? leadershipAlerts : undefined,
          updatedAt: dept.updatedAt,
        };
      }),
    );

    return result;
  }

  async getOverview() {
    const totalDepartments = await this.departmentModel.count();
    const activeDepartments = await this.departmentModel.count({
      where: { status: 'active' },
    });

    const totalUnits = await this.unitModel.count({
      where: { departmentId: { [Op.ne]: null } },
    });

    const unitsWithDept = await this.unitModel.findAll({
      where: { departmentId: { [Op.ne]: null } },
      attributes: ['id'],
    });
    const unitIds = unitsWithDept.map((u) => u.id);
    let totalMembers = 0;
    if (unitIds.length > 0) {
      totalMembers = await this.unitMembershipModel.count({
        where: { unitId: { [Op.in]: unitIds }, isActive: true },
        distinct: true,
        col: 'member_id',
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const deptsWithExpiring = await this.leadershipAssignmentModel.findAll({
      where: {
        scopeEntity: 'DEPARTMENT',
        leadershipStatus: 'active',
        [Op.or]: [
          { endDate: { [Op.between]: [today, thirtyDaysFromNow] } },
          { endDate: { [Op.lt]: today } },
        ],
      },
      attributes: ['scopeId'],
    });
    const deptIdsWithAlerts = [
      ...new Set(deptsWithExpiring.map((a) => a.scopeId).filter(Boolean)),
    ];
    const withAlerts = deptIdsWithAlerts.length;

    return {
      totalDepartments,
      activeDepartments,
      totalUnits,
      totalMembers,
      withAlerts,
    };
  }

  async findOne(id: string): Promise<Department> {
    const dept = await this.departmentModel.findByPk(id);
    if (!dept) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
    return dept;
  }

  async getDetails(id: string) {
    const dept = await this.departmentModel.findByPk(id, {
      include: [
        {
          model: Member,
          as: 'headOfDepartment',
          attributes: [
            'id',
            'firstName',
            'middleName',
            'surname',
            'email',
            'phone',
          ],
          required: false,
        },
      ],
    });
    if (!dept) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    const units = await this.unitModel.findAll({
      where: { departmentId: dept.id },
      attributes: ['id'],
    });
    const unitIds = units.map((u) => u.id);

    let totalMembers = 0;
    let activeMembers = 0;
    if (unitIds.length > 0) {
      const [total, active] = await Promise.all([
        this.unitMembershipModel.count({
          where: { unitId: { [Op.in]: unitIds } },
          distinct: true,
          col: 'member_id',
        }),
        this.unitMembershipModel.count({
          where: { unitId: { [Op.in]: unitIds }, isActive: true },
          distinct: true,
          col: 'member_id',
        }),
      ]);
      totalMembers = total;
      activeMembers = active;
    }

    const leadershipCount = await this.leadershipAssignmentModel.count({
      where: {
        scopeEntity: 'DEPARTMENT',
        scopeId: dept.id,
        leadershipStatus: { [Op.in]: ['active', 'acting'] },
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const leadershipAlerts =
      (await this.leadershipAssignmentModel.count({
        where: {
          scopeEntity: 'DEPARTMENT',
          scopeId: dept.id,
          leadershipStatus: 'active',
          endDate: { [Op.between]: [today, thirtyDaysFromNow] },
        },
      })) +
      (await this.leadershipAssignmentModel.count({
        where: {
          scopeEntity: 'DEPARTMENT',
          scopeId: dept.id,
          leadershipStatus: 'active',
          endDate: { [Op.lt]: today },
        },
      }));

    let head =
      dept.headOfDepartment &&
      [
        dept.headOfDepartment.firstName,
        dept.headOfDepartment.middleName,
        dept.headOfDepartment.surname,
      ]
        .filter(Boolean)
        .join(' ');
    let headEmail = dept.headOfDepartment?.email;
    let headPhone = dept.headOfDepartment?.phone;

    // If no head from department field, use "Head of Department" assignment
    if (!head) {
      const headRole = await this.leadershipRoleTemplateModel.findOne({
        where: {
          name: { [Op.iLike]: '%head of department%' },
          category: 'DEPARTMENT',
        },
      });
      if (headRole) {
        const headAssignment = await this.leadershipAssignmentModel.findOne({
          where: {
            templateId: headRole.id,
            scopeEntity: 'DEPARTMENT',
            scopeId: dept.id,
            leadershipStatus: { [Op.in]: ['active', 'acting'] },
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
        if (headAssignment?.member) {
          const m = (headAssignment as any).member;
          head = [m.firstName, m.middleName, m.surname]
            .filter(Boolean)
            .join(' ');
          headEmail = m.email;
          headPhone = m.phone;
        }
      }
    }

    return {
      id: dept.id,
      name: dept.name,
      category: dept.category,
      description: dept.description,
      status: dept.status,
      headOfDepartment: head
        ? {
            name: head,
            email: headEmail,
            phone: headPhone,
          }
        : undefined,
      meetingDay: dept.meetingDay,
      meetingTime: dept.meetingTime,
      foundedDate: dept.foundedDate,
      maxUnits: dept.maxUnits ?? undefined,
      totalMembers,
      activeMembers,
      unitsCount: units.length,
      leadershipCount,
      leadershipAlerts,
      updatedAt: dept.updatedAt,
    };
  }

  async getUnits(id: string) {
    await this.findOne(id);

    const units = await this.unitModel.findAll({
      where: { departmentId: id },
      order: [['name', 'ASC']],
    });

    const headOfUnitRole = await this.leadershipRoleTemplateModel.findOne({
      where: { name: { [Op.iLike]: '%head of unit%' }, category: 'UNIT' },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const result = await Promise.all(
      units.map(async (unit) => {
        const memberCount = await this.unitMembershipModel.count({
          where: { unitId: unit.id, isActive: true },
        });

        let leader: string | undefined;
        if (headOfUnitRole) {
          const assignment = await this.leadershipAssignmentModel.findOne({
            where: {
              templateId: headOfUnitRole.id,
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
          if (assignment?.member) {
            leader = [
              assignment.member.firstName,
              assignment.member.middleName,
              assignment.member.surname,
            ]
              .filter(Boolean)
              .join(' ');
          }
        }

        const alerts = await this.leadershipAssignmentModel.count({
          where: {
            scopeEntity: 'UNIT',
            scopeId: unit.id,
            leadershipStatus: 'active',
            [Op.or]: [
              { endDate: { [Op.between]: [today, thirtyDaysFromNow] } },
              { endDate: { [Op.lt]: today } },
            ],
          },
        });

        return {
          id: unit.id,
          name: unit.name,
          code: unit.code,
          status: unit.status,
          leader,
          memberCount,
          alerts: alerts > 0 ? alerts : undefined,
        };
      }),
    );

    return result;
  }

  async getMembers(id: string) {
    await this.findOne(id);

    const units = await this.unitModel.findAll({
      where: { departmentId: id },
      attributes: ['id', 'name'],
    });
    const unitIds = units.map((u) => u.id);
    if (unitIds.length === 0) return [];

    const memberships = await this.unitMembershipModel.findAll({
      where: { unitId: { [Op.in]: unitIds } },
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
        { model: Unit, as: 'unit', attributes: ['id', 'name'] },
      ],
      order: [['startDate', 'ASC']],
    });

    const byMemberId = new Map<
      string,
      { member: Member; units: string[]; isActive: boolean }
    >();
    for (const m of memberships) {
      const member = (m as any).member;
      const unit = (m as any).unit;
      const key = member.id;
      if (!byMemberId.has(key)) {
        byMemberId.set(key, {
          member,
          units: [],
          isActive: (m as any).isActive,
        });
      }
      const entry = byMemberId.get(key)!;
      if (unit && !entry.units.includes(unit.name)) entry.units.push(unit.name);
      entry.isActive = entry.isActive || (m as any).isActive;
    }

    return Array.from(byMemberId.entries()).map(([, v]) => {
      const name = [v.member.firstName, v.member.middleName, v.member.surname]
        .filter(Boolean)
        .join(' ');
      let age: number | undefined;
      if (v.member.dob) age = this.calculateAge(v.member.dob);
      return {
        id: v.member.id,
        name: name || 'Unknown',
        gender: v.member.gender,
        age,
        email: v.member.email,
        phone: v.member.phone,
        attendancePercent: undefined,
        status:
          v.isActive && v.member.suspensionStatus === 'active'
            ? 'Active'
            : 'Inactive',
        unitName: v.units.join(', ') || undefined,
      };
    });
  }

  async getLeadership(id: string) {
    const dept = await this.departmentModel.findByPk(id, {
      include: [
        {
          model: Member,
          as: 'headOfDepartment',
          attributes: ['id', 'firstName', 'middleName', 'surname'],
          required: false,
        },
      ],
    });
    if (!dept) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    const assignments = await this.leadershipAssignmentModel.findAll({
      where: {
        scopeEntity: 'DEPARTMENT',
        scopeId: id,
        leadershipStatus: { [Op.in]: ['active', 'acting', 'inactive'] },
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
          attributes: ['id', 'firstName', 'middleName', 'surname'],
        },
      ],
      order: [['startDate', 'DESC']],
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const list = assignments.map((a) => {
      const member = (a as any).member;
      const name = member
        ? [member.firstName, member.middleName, member.surname]
            .filter(Boolean)
            .join(' ')
        : 'Unknown';
      let daysUntilExpiry: number | undefined;
      if (a.endDate && (a as any).leadershipStatus === 'active') {
        const end = new Date(a.endDate);
        end.setHours(0, 0, 0, 0);
        const diff = Math.ceil(
          (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (diff > 0) daysUntilExpiry = diff;
      }
      return {
        id: a.id,
        memberId: (a as any).memberId,
        name,
        role: (a as any).template?.name ?? 'Unknown',
        status: (a as any).leadershipStatus,
        endDate: a.endDate ?? undefined,
        daysUntilExpiry,
      };
    });

    const assignedMemberIds = new Set(list.map((a) => (a as any).memberId));
    // If department has headOfDepartmentId but that member is not in assignments, add them as "Head of Department"
    if (
      dept.headOfDepartmentId &&
      !assignedMemberIds.has(dept.headOfDepartmentId)
    ) {
      const head = dept.headOfDepartment;
      const headName = head
        ? [head.firstName, head.middleName, head.surname]
            .filter(Boolean)
            .join(' ')
        : 'Unknown';
      list.unshift({
        id: `head-${dept.headOfDepartmentId}`,
        memberId: dept.headOfDepartmentId,
        name: headName,
        role: 'Head of Department',
        status: 'active',
        endDate: undefined,
        daysUntilExpiry: undefined,
      });
    }

    return list.map((a) => ({
      id: a.id,
      name: a.name,
      role: a.role,
      status: a.status,
      endDate: a.endDate,
      daysUntilExpiry: a.daysUntilExpiry,
    }));
  }

  async update(
    id: string,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    const dept = await this.findOne(id);
    const data: any = { ...updateDepartmentDto };
    if (data.foundedDate && typeof data.foundedDate === 'string') {
      data.foundedDate = new Date(data.foundedDate);
    }
    await dept.update(data);
    return dept.reload();
  }

  async remove(id: string): Promise<{ message: string }> {
    const dept = await this.findOne(id);
    const unitCount = await this.unitModel.count({
      where: { departmentId: id },
    });
    if (unitCount > 0) {
      throw new BadRequestException(
        'Cannot delete department that has units. Reassign or remove units first.',
      );
    }
    await dept.destroy();
    return { message: 'Department deleted successfully' };
  }

  async addMember(departmentId: string, dto: AddDepartmentMemberDto) {
    await this.findOne(departmentId);
    const unit = await this.unitModel.findOne({
      where: { id: dto.unitId, departmentId },
    });
    if (!unit) {
      throw new BadRequestException(
        'Unit does not belong to this department or unit not found',
      );
    }

    const member = await this.memberModel.findByPk(dto.memberId);
    if (!member) {
      throw new NotFoundException('Member not found');
    }

    const existing = await this.unitMembershipModel.findOne({
      where: {
        unitId: dto.unitId,
        memberId: dto.memberId,
        isActive: true,
      },
    });
    if (existing) {
      throw new BadRequestException('Member is already in this unit');
    }

    return this.unitMembershipModel.create({
      unitId: dto.unitId,
      memberId: dto.memberId,
      startDate: new Date(),
      isActive: true,
    });
  }

  async addUnit(departmentId: string, createUnitDto: CreateUnitDto) {
    const dept = await this.findOne(departmentId);

    if (dept.maxUnits != null) {
      const currentCount = await this.unitModel.count({
        where: { departmentId: departmentId },
      });
      if (currentCount >= dept.maxUnits) {
        throw new BadRequestException(
          `Department allows maximum ${dept.maxUnits} units. Cannot add more.`,
        );
      }
    }

    const existing = await this.unitModel.findOne({
      where: { name: createUnitDto.name },
    });
    if (existing) {
      throw new BadRequestException('Unit name already exists');
    }

    const data: any = { ...createUnitDto, departmentId };
    if (data.foundedDate && typeof data.foundedDate === 'string') {
      data.foundedDate = new Date(data.foundedDate);
    }
    return this.unitModel.create(data);
  }
}
