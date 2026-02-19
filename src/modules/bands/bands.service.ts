import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Band } from '../../database/models/band.model';
import { BandMembership } from '../../database/models/band-membership.model';
import { Member } from '../../database/models/member.model';
import { LeadershipAssignment } from '../../database/models/leadership-assignment.model';
import { LeadershipRoleTemplate } from '../../database/models/leadership-role-template.model';
import { CreateBandDto } from './dto/create-band.dto';
import { UpdateBandDto } from './dto/update-band.dto';
import { AddBandMemberDto } from './dto/add-band-member.dto';
import { AssignBandExecutiveDto } from './dto/assign-band-executive.dto';

/**
 * Bands Service
 * Handles band management, member assignments, and executive assignments
 */
@Injectable()
export class BandsService {
  constructor(
    @InjectModel(Band)
    private bandModel: typeof Band,
    @InjectModel(BandMembership)
    private bandMembershipModel: typeof BandMembership,
    @InjectModel(Member)
    private memberModel: typeof Member,
    @InjectModel(LeadershipAssignment)
    private leadershipAssignmentModel: typeof LeadershipAssignment,
    @InjectModel(LeadershipRoleTemplate)
    private leadershipRoleTemplateModel: typeof LeadershipRoleTemplate,
  ) {}

  /**
   * Create a new band
   */
  async createBand(createBandDto: CreateBandDto): Promise<Band> {
    // Check if band name already exists
    const existing = await this.bandModel.findOne({
      where: { name: createBandDto.name },
    });
    if (existing) {
      throw new BadRequestException('Band name already exists');
    }

    const createData: any = { ...createBandDto };
    // Convert foundedDate string to Date if provided
    if (createData.foundedDate && typeof createData.foundedDate === 'string') {
      createData.foundedDate = new Date(createData.foundedDate);
    }

    return this.bandModel.create(createData);
  }

  /**
   * Get all bands with overview statistics (no detailed membership info)
   * Returns summary: total members, active members, overgrown members, last updated
   */
  async getAllBands(search?: string) {
    const where: any = { status: 'active' };

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { code: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const bands = await this.bandModel.findAll({
      where,
      order: [['name', 'ASC']],
    });

    // Get overview statistics for each band
    const bandsWithOverview = await Promise.all(
      bands.map(async (band) => {
        // Get all active memberships with member data
        const memberships = await this.bandMembershipModel.findAll({
          where: { bandId: band.id, isActive: true },
          include: [
            {
              model: Member,
              as: 'member',
              attributes: ['id', 'dob'],
            },
          ],
        });

        const totalMembers = memberships.length;

        // Calculate overgrown members dynamically based on age
        let overgrownCount = 0;
        if (band.hasAgeBracket && band.maxAge !== null) {
          for (const membership of memberships) {
            if (membership.member?.dob) {
              const age = this.calculateAge(membership.member.dob);
              if (age > band.maxAge) {
                overgrownCount++;
                // Update the overgrown flag if not already set
                if (!membership.overgrownFlag) {
                  await membership.update({
                    overgrownFlag: true,
                    overgrownAt: new Date(),
                  });
                }
              } else if (membership.overgrownFlag) {
                // Member is no longer overgrown, update flag
                await membership.update({
                  overgrownFlag: false,
                  overgrownAt: null,
                });
              }
            }
          }
        }

        // Active members = total members (since we're only counting isActive: true)
        const activeMembers = totalMembers;

        // Format age bracket string
        let ageBracket: string | undefined;
        if (
          band.hasAgeBracket &&
          band.minAge !== null &&
          band.maxAge !== null
        ) {
          ageBracket = `${band.minAge}-${band.maxAge} years`;
        }

        return {
          id: band.id,
          name: band.name,
          code: band.code,
          bandType: band.bandType,
          hasAgeBracket: band.hasAgeBracket,
          minAge: band.minAge,
          maxAge: band.maxAge,
          ageBracket,
          description: band.description,
          status: band.status,
          totalMembers,
          activeMembers,
          overgrownMembers: overgrownCount,
          updatedAt: band.updatedAt,
        };
      }),
    );

    return bandsWithOverview;
  }

  /**
   * Get band by ID with details
   */
  async getBandById(id: string): Promise<Band> {
    const band = await this.bandModel.findByPk(id, {
      include: [
        {
          model: BandMembership,
          as: 'memberships',
          where: { isActive: true },
          required: false,
          include: [{ model: Member, as: 'member' }],
        },
      ],
    });

    if (!band) {
      throw new NotFoundException(`Band with ID ${id} not found`);
    }

    return band;
  }

  /**
   * Get band details with coordinator information
   */
  async getBandDetails(id: string) {
    const band = await this.getBandById(id);

    // Find coordinator (Band Coordinator role)
    const coordinatorRole = await this.leadershipRoleTemplateModel.findOne({
      where: {
        name: { [Op.iLike]: '%coordinator%' },
        category: 'BAND',
      },
    });

    let coordinator = null;
    if (coordinatorRole) {
      const coordinatorAssignment =
        await this.leadershipAssignmentModel.findOne({
          where: {
            templateId: coordinatorRole.id,
            scopeEntity: 'BAND',
            scopeId: band.id,
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

    // Find captain (Band Captain role)
    const captainRole = await this.leadershipRoleTemplateModel.findOne({
      where: {
        name: { [Op.iLike]: '%captain%' },
        category: 'BAND',
      },
    });

    let captain = null;
    if (captainRole) {
      const captainAssignment = await this.leadershipAssignmentModel.findOne({
        where: {
          templateId: captainRole.id,
          scopeEntity: 'BAND',
          scopeId: band.id,
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

      if (captainAssignment?.member) {
        const member = captainAssignment.member;
        const name = [member.firstName, member.middleName, member.surname]
          .filter(Boolean)
          .join(' ');
        captain = {
          name: name || 'Unknown',
          email: member.email,
          phone: member.phone,
        };
      }
    }

    // Count total active members
    const totalMembers = await this.bandMembershipModel.count({
      where: { bandId: band.id, isActive: true },
    });

    // Format age bracket string
    let ageBracket: string | undefined;
    if (band.hasAgeBracket && band.minAge !== null && band.maxAge !== null) {
      ageBracket = `${band.minAge}-${band.maxAge} years`;
    }

    return {
      id: band.id,
      name: band.name,
      code: band.code,
      bandType: band.bandType,
      hasAgeBracket: band.hasAgeBracket,
      minAge: band.minAge,
      maxAge: band.maxAge,
      ageBracket,
      description: band.description,
      status: band.status,
      coordinator: coordinator || undefined,
      captain: captain || undefined,
      foundedDate: band.foundedDate || undefined,
      meetingScheduleDay: band.meetingScheduleDay || undefined,
      meetingScheduleTime: band.meetingScheduleTime || undefined,
      totalMembers,
      updatedAt: band.updatedAt,
    };
  }

  /**
   * Get band leadership team
   */
  async getBandLeadershipTeam(bandId: string) {
    // Verify band exists
    await this.getBandById(bandId);

    const assignments = await this.leadershipAssignmentModel.findAll({
      where: {
        scopeEntity: 'BAND',
        scopeId: bandId,
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
   * Get band members with detailed information
   */
  async getBandMembers(bandId: string) {
    // Verify band exists and get band details for age bracket check
    const band = await this.getBandById(bandId);

    const memberships = await this.bandMembershipModel.findAll({
      where: { bandId: bandId, isActive: true },
      include: [
        {
          model: Member,
          as: 'member',
          attributes: [
            'id',
            'memberCode',
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

      // Check if overgrown
      let isOvergrown = false;
      if (band.hasAgeBracket && band.maxAge !== null && age !== undefined) {
        isOvergrown = age > band.maxAge;
        // Update the flag if needed
        if (isOvergrown !== membership.overgrownFlag) {
          membership.update({
            overgrownFlag: isOvergrown,
            overgrownAt: isOvergrown ? new Date() : null,
          });
        }
      }

      return {
        id: member.id,
        memberCode: member.memberCode || 'N/A',
        name: name || 'Unknown',
        gender: member.gender,
        age,
        joinDate: membership.startDate,
        attendance: null, // Attendance tracking not yet implemented
        status: member.suspensionStatus === 'suspended' ? 'inactive' : 'active',
        isOvergrown,
      };
    });
  }

  /**
   * Update band
   */
  async updateBand(id: string, updateBandDto: UpdateBandDto): Promise<Band> {
    const band = await this.getBandById(id);
    const updateData: any = { ...updateBandDto };
    // Convert foundedDate string to Date if provided
    if (updateData.foundedDate && typeof updateData.foundedDate === 'string') {
      updateData.foundedDate = new Date(updateData.foundedDate);
    }
    await band.update(updateData);
    return band.reload();
  }

  /**
   * Delete band (archive)
   */
  async deleteBand(id: string): Promise<void> {
    const band = await this.getBandById(id);
    await band.update({ status: 'archived' });
  }

  /**
   * Add member to band
   */
  async addMemberToBand(bandId: string, addMemberDto: AddBandMemberDto) {
    const band = await this.getBandById(bandId);
    const member = await this.memberModel.findByPk(addMemberDto.memberId);
    if (!member) {
      throw new NotFoundException('Member not found');
    }

    // Check if member is already in this band
    const existingInThisBand = await this.bandMembershipModel.findOne({
      where: {
        memberId: addMemberDto.memberId,
        bandId: bandId,
        isActive: true,
      },
    });

    if (existingInThisBand) {
      throw new BadRequestException(
        'This member has already been assigned to this band',
      );
    }

    // Check if member already has an active band membership in another band
    const existingActive = await this.bandMembershipModel.findOne({
      where: { memberId: addMemberDto.memberId, isActive: true },
    });

    if (existingActive && existingActive.bandId !== bandId) {
      // Deactivate previous membership
      await existingActive.update({
        isActive: false,
        endDate: new Date(),
        exitReason: 'transfer',
      });
    }

    // Check age bracket if band has one
    if (band.hasAgeBracket && member.dob) {
      const age = this.calculateAge(member.dob);
      if (band.minAge && age < band.minAge) {
        throw new BadRequestException(
          `Member age ${age} is below minimum age ${band.minAge}`,
        );
      }
      if (band.maxAge && age > band.maxAge) {
        throw new BadRequestException(
          `Member age ${age} exceeds maximum age ${band.maxAge}`,
        );
      }
    }

    // Check gender compatibility
    if (band.bandType === 'male' && member.gender !== 'male') {
      throw new BadRequestException('Only male members can join this band');
    }
    if (band.bandType === 'female' && member.gender !== 'female') {
      throw new BadRequestException('Only female members can join this band');
    }

    // Create new membership
    const startDate = addMemberDto.startDate
      ? new Date(addMemberDto.startDate)
      : new Date();

    return this.bandMembershipModel.create({
      bandId,
      memberId: addMemberDto.memberId,
      startDate,
      isActive: true,
    });
  }

  /**
   * Remove member from band
   * Deactivates the membership by setting isActive to false
   */
  async removeMemberFromBand(
    bandId: string,
    memberId: string,
  ): Promise<{ message: string }> {
    const band = await this.getBandById(bandId);
    const member = await this.memberModel.findByPk(memberId);

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    const membership = await this.bandMembershipModel.findOne({
      where: {
        bandId: band.id,
        memberId: memberId,
        isActive: true,
      },
    });

    if (!membership) {
      throw new NotFoundException(
        `Member is not currently active in this band`,
      );
    }

    // Deactivate membership
    await membership.update({
      isActive: false,
      endDate: new Date(),
      exitReason: 'left',
    });

    return {
      message: 'Member removed from band successfully',
    };
  }

  /**
   * Assign band executive
   * Executives: Patron, Matron, Captain, Vice-Captain, Secretary
   * Minimum tenure: 2 years
   */
  async assignBandExecutive(
    bandId: string,
    assignDto: AssignBandExecutiveDto,
  ): Promise<LeadershipAssignment> {
    // Verify band exists
    await this.getBandById(bandId);
    const member = await this.memberModel.findByPk(assignDto.memberId);
    if (!member) {
      throw new NotFoundException('Member not found');
    }

    // Find or create leadership role template
    // Handle role name formatting (e.g., 'vice_captain' -> 'Vice Captain')
    const roleNameFormatted = assignDto.role
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    let roleTemplate = await this.leadershipRoleTemplateModel.findOne({
      where: {
        name: `Band ${roleNameFormatted}`,
        category: 'BAND',
      },
    });

    if (!roleTemplate) {
      roleTemplate = await this.leadershipRoleTemplateModel.create({
        name: `Band ${roleNameFormatted}`,
        category: 'BAND',
        scopeType: 'contextual',
        requiresTenure: true,
        defaultTenureMonths: 24, // 2 years
      });
    }

    // Calculate end date (2 years from start)
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
        scopeEntity: 'BAND',
        scopeId: bandId,
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
      scopeEntity: 'BAND',
      scopeId: bandId,
      startDate,
      endDate,
      leadershipStatus: 'active',
    });
  }

  /**
   * Get band overview statistics
   */
  async getBandsOverview() {
    const totalBands = await this.bandModel.count({
      where: { status: 'active' },
    });
    const totalMembers = await this.bandMembershipModel.count({
      where: { isActive: true },
      distinct: true,
      col: 'member_id',
    });

    // Count active alerts (overgrown members)
    const activeAlerts = await this.bandMembershipModel.count({
      where: { overgrownFlag: true, isActive: true },
      distinct: true,
      col: 'band_id',
    });

    // Calculate average occupancy
    const bands = await this.bandModel.findAll({
      where: { status: 'active' },
      include: [
        {
          model: BandMembership,
          as: 'memberships',
          where: { isActive: true },
          required: false,
        },
      ],
    });

    // Note: This is a simplified calculation
    // You may want to add a capacity field to bands table
    const avgOccupancy = bands.length > 0 ? 70 : 0; // Placeholder

    return {
      totalBands,
      totalMembers,
      activeAlerts,
      avgOccupancy,
    };
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
