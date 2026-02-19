import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Member } from '../../database/models/member.model';
import { BandMembership } from '../../database/models/band-membership.model';
import { UnitMembership } from '../../database/models/unit-membership.model';
import { Band } from '../../database/models/band.model';
import { Unit } from '../../database/models/unit.model';
import { ClassEnrollment } from '../../database/models/class-enrollment.model';
import { ClassType } from '../../database/models/class-type.model';
import { ClassBatch } from '../../database/models/class-batch.model';
import { MemberAcademic } from '../../database/models/member-academic.model';
import { MemberEmployment } from '../../database/models/member-employment.model';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MemberQueryDto } from './dto/member-query.dto';
import { MemberOverviewDto } from './dto/member-overview.dto';
import csv from 'csv-parser';
import { Readable } from 'stream';

/**
 * Members Service
 * Handles all member-related business logic
 */
@Injectable()
export class MembersService {
  constructor(
    @InjectModel(Member)
    private memberModel: typeof Member,
    @InjectModel(BandMembership)
    private bandMembershipModel: typeof BandMembership,
    @InjectModel(UnitMembership)
    private unitMembershipModel: typeof UnitMembership,
    @InjectModel(Band)
    private bandModel: typeof Band,
    @InjectModel(Unit)
    private unitModel: typeof Unit,
    @InjectModel(ClassEnrollment)
    private classEnrollmentModel: typeof ClassEnrollment,
    @InjectModel(ClassType)
    private classTypeModel: typeof ClassType,
    @InjectModel(ClassBatch)
    private classBatchModel: typeof ClassBatch,
    @InjectModel(MemberAcademic)
    private memberAcademicModel: typeof MemberAcademic,
    @InjectModel(MemberEmployment)
    private memberEmploymentModel: typeof MemberEmployment,
  ) {}

  /**
   * Generate unique member code
   * Format: BCM + sequential number
   */
  private async generateMemberCode(): Promise<string> {
    const lastMember = await this.memberModel.findOne({
      order: [['created_at', 'DESC']],
      attributes: ['member_code'],
    });

    if (!lastMember || !lastMember.memberCode) {
      return 'BCM1001';
    }

    const lastNumber = parseInt(lastMember.memberCode.replace('BCM', ''), 10);
    return `BCM${lastNumber + 1}`;
  }

  /**
   * Find current active class batch for a class type
   */
  private async findCurrentActiveBatch(
    classTypeCode: string,
  ): Promise<ClassBatch | null> {
    const classType = await this.classTypeModel.findOne({
      where: { code: classTypeCode },
    });

    if (!classType) {
      return null;
    }

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    let intake: string;
    if (classType.cadence === 'annual') {
      intake = 'ANNUAL';
    } else {
      // Biannual: JAN (Jan-Jul) or AUG (Aug-Dec)
      intake = currentMonth >= 8 ? 'AUG' : 'JAN';
    }

    const batch = await this.classBatchModel.findOne({
      where: {
        classTypeId: classType.id,
        year: currentYear,
        intake,
        status: 'open',
      },
      order: [['created_at', 'DESC']],
    });

    return batch;
  }

  /**
   * Create a new member with all related data (Steps 1, 2, and 3)
   */
  async createMember(createMemberDto: CreateMemberDto): Promise<Member> {
    // Generate member code if not provided
    if (!createMemberDto.memberCode) {
      createMemberDto.memberCode = await this.generateMemberCode();
    } else {
      // Check if member code already exists
      const existing = await this.memberModel.findOne({
        where: { memberCode: createMemberDto.memberCode },
      });
      if (existing) {
        throw new BadRequestException('Member code already exists');
      }
    }

    // Check email uniqueness if provided
    if (createMemberDto.email) {
      const existing = await this.memberModel.findOne({
        where: { email: createMemberDto.email },
      });
      if (existing) {
        throw new BadRequestException('Email already exists');
      }
    }

    // Check phone uniqueness if provided
    if (createMemberDto.phone) {
      const existing = await this.memberModel.findOne({
        where: { phone: createMemberDto.phone },
      });
      if (existing) {
        throw new BadRequestException('Phone already exists');
      }
    }

    // Extract Step 2 and 3 data before creating member
    const {
      bandId,
      unitIds,
      enrollPreYouth,
      enrollBaptismal,
      enrollETS,
      classBatchIds,
      academics,
      placeOfWork,
      officeAddress,
      ...memberData
    } = createMemberDto;

    // Step 1: Create the member
    const member = await this.memberModel.create(memberData as any);

    // Step 2: Handle Band Assignment
    if (bandId) {
      const band = await this.bandModel.findByPk(bandId);
      if (!band) {
        throw new NotFoundException(`Band with ID ${bandId} not found`);
      }

      // Check if member already has an active band membership
      const existingActiveBand = await this.bandMembershipModel.findOne({
        where: { memberId: member.id, isActive: true },
      });

      if (existingActiveBand) {
        // Deactivate previous membership
        await existingActiveBand.update({
          isActive: false,
          endDate: new Date(),
          exitReason: 'transfer',
        });
      }

      // Create new band membership
      await this.bandMembershipModel.create({
        bandId,
        memberId: member.id,
        startDate: new Date(),
        isActive: true,
      });
    }

    // Step 2: Handle Unit Assignments
    if (unitIds && unitIds.length > 0) {
      // Verify all units exist
      const units = await this.unitModel.findAll({
        where: { id: { [Op.in]: unitIds } },
      });

      if (units.length !== unitIds.length) {
        throw new NotFoundException('One or more units not found');
      }

      // Create unit memberships
      await Promise.all(
        unitIds.map((unitId) =>
          this.unitMembershipModel.create({
            unitId,
            memberId: member.id,
            startDate: new Date(),
            isActive: true,
          }),
        ),
      );
    }

    // Step 2: Handle Class Enrollments
    const enrollmentsToCreate: { batchId: string; classTypeCode: string }[] =
      [];

    // If specific batch IDs are provided, use those
    if (classBatchIds && classBatchIds.length > 0) {
      const batches = await this.classBatchModel.findAll({
        where: { id: { [Op.in]: classBatchIds }, status: 'open' },
        include: [{ model: ClassType, as: 'classType' }],
      });

      if (batches.length !== classBatchIds.length) {
        throw new NotFoundException(
          'One or more class batches not found or not open',
        );
      }

      batches.forEach((batch) => {
        enrollmentsToCreate.push({
          batchId: batch.id,
          classTypeCode: batch.classType.code,
        });
      });
    } else {
      // Otherwise, find current active batches based on enrollment flags
      if (enrollPreYouth) {
        const batch = await this.findCurrentActiveBatch('PREYOUTH');
        if (batch) {
          enrollmentsToCreate.push({
            batchId: batch.id,
            classTypeCode: 'PREYOUTH',
          });
        }
      }

      if (enrollBaptismal) {
        const batch = await this.findCurrentActiveBatch('BAPTISMAL');
        if (batch) {
          enrollmentsToCreate.push({
            batchId: batch.id,
            classTypeCode: 'BAPTISMAL',
          });
        }
      }

      if (enrollETS) {
        const batch = await this.findCurrentActiveBatch('ETS');
        if (batch) {
          enrollmentsToCreate.push({ batchId: batch.id, classTypeCode: 'ETS' });
        }
      }
    }

    // Create class enrollments
    await Promise.all(
      enrollmentsToCreate.map(({ batchId }) =>
        this.classEnrollmentModel.create({
          batchId,
          memberId: member.id,
          attemptNo: 1,
          enrollmentStatus: 'enrolled',
          source: 'manual',
          enrolledAt: new Date(),
        }),
      ),
    );

    // Step 3: Handle Academics
    if (academics && academics.length > 0) {
      await Promise.all(
        academics.map((academic) =>
          this.memberAcademicModel.create({
            memberId: member.id,
            institution: academic.institution,
            courseProgram: academic.courseProgram,
            qualification: academic.qualification,
            startDate: academic.startDate ? new Date(academic.startDate) : null,
            endDate: academic.endDate ? new Date(academic.endDate) : null,
          }),
        ),
      );
    }

    // Step 3: Handle Employment
    if (placeOfWork) {
      await this.memberEmploymentModel.create({
        memberId: member.id,
        placeOfWork,
        officeAddress: officeAddress || null,
      });
    }

    // Reload member with all associations
    return this.memberModel.findByPk(member.id, {
      include: [
        { model: BandMembership, as: 'bandMemberships' },
        { model: UnitMembership, as: 'unitMemberships' },
        { model: ClassEnrollment, as: 'classEnrollments' },
        { model: MemberAcademic, as: 'academics' },
        { model: MemberEmployment, as: 'employment' },
      ],
    });
  }

  /**
   * Get all members with pagination and filters
   */
  async getAllMembers(query: MemberQueryDto) {
    const {
      search,
      gender,
      bandId,
      unitId,
      // classBatchId - Reserved for future class batch filtering
      status,
      page = 1,
      limit = 10,
    } = query;

    const offset = (page - 1) * limit;
    const where: any = {};

    // Search filter
    if (search) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { surname: { [Op.iLike]: `%${search}%` } },
        { memberCode: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Gender filter
    if (gender) {
      where.gender = gender;
    }

    // Status filter
    if (status === 'active') {
      where.suspensionStatus = 'active';
    } else if (status === 'suspended') {
      where.suspensionStatus = 'suspended';
    }

    const include: any[] = [];

    // Band filter
    if (bandId) {
      include.push({
        model: BandMembership,
        as: 'bandMemberships',
        where: { bandId, isActive: true },
        include: [
          {
            model: Band,
            as: 'band',
          },
        ],
      });
    }

    // Unit filter
    if (unitId) {
      include.push({
        model: UnitMembership,
        as: 'unitMemberships',
        where: { unitId, isActive: true },
        include: [
          {
            model: Unit,
            as: 'unit',
          },
        ],
      });
    }

    // Overgrown filter
    let overgrownMembers: string[] = [];
    if (status === 'overgrown') {
      const overgrown = await this.bandMembershipModel.findAll({
        where: { overgrownFlag: true, isActive: true },
        attributes: ['memberId'],
      });
      overgrownMembers = overgrown.map((m) => m.memberId);
      if (overgrownMembers.length === 0) {
        return { data: [], total: 0, page, limit };
      }
      where.id = { [Op.in]: overgrownMembers };
    }

    const { rows, count } = await this.memberModel.findAndCountAll({
      where,
      include: include.length > 0 ? include : undefined,
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  /**
   * Get member by ID
   */
  async getMemberById(id: string): Promise<Member> {
    const member = await this.memberModel.findByPk(id, {
      include: [
        {
          model: BandMembership,
          as: 'bandMemberships',
          where: { isActive: true },
          include: [{ model: Band, as: 'band' }],
          required: false,
        },
        {
          model: UnitMembership,
          as: 'unitMemberships',
          where: { isActive: true },
          include: [{ model: Unit, as: 'unit' }],
          required: false,
        },
        {
          model: ClassEnrollment,
          as: 'classEnrollments',
          include: [
            {
              model: ClassBatch,
              include: [{ model: ClassType, as: 'classType' }],
            },
          ],
          required: false,
        },
      ],
    });

    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }

    return member;
  }

  /**
   * Update member
   */
  async updateMember(
    id: string,
    updateMemberDto: UpdateMemberDto,
  ): Promise<Member> {
    const member = await this.getMemberById(id);

    // Check email uniqueness if being updated
    if (updateMemberDto.email && updateMemberDto.email !== member.email) {
      const existing = await this.memberModel.findOne({
        where: { email: updateMemberDto.email },
      });
      if (existing) {
        throw new BadRequestException('Email already exists');
      }
    }

    // Check phone uniqueness if being updated
    if (updateMemberDto.phone && updateMemberDto.phone !== member.phone) {
      const existing = await this.memberModel.findOne({
        where: { phone: updateMemberDto.phone },
      });
      if (existing) {
        throw new BadRequestException('Phone already exists');
      }
    }

    // Convert string dates to Date objects for Sequelize
    const updateData: any = { ...updateMemberDto };
    if (updateData.dob && typeof updateData.dob === 'string') {
      updateData.dob = new Date(updateData.dob);
    }

    await member.update(updateData);
    return member.reload();
  }

  /**
   * Soft delete member (only superadmin)
   * Sets deleted_at timestamp instead of removing from database
   */
  async deleteMember(id: string): Promise<void> {
    const member = await this.memberModel.findByPk(id, {
      paranoid: false, // Include deleted members to check if already deleted
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    if (member.deletedAt) {
      throw new BadRequestException('Member is already deleted');
    }

    // Soft delete - sets deleted_at timestamp
    await member.destroy();
  }

  /**
   * Restore a soft-deleted member (only superadmin)
   * Removes deleted_at timestamp to restore the member
   */
  async restore(id: string): Promise<Member> {
    const member = await this.memberModel.findByPk(id, {
      paranoid: false, // Include deleted members
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    if (!member.deletedAt) {
      throw new BadRequestException('Member is not deleted');
    }

    // Restore by setting deleted_at to null
    member.deletedAt = null;
    await member.save();

    return member.reload();
  }

  /**
   * Get member overview statistics
   */
  async getMembersOverview(): Promise<MemberOverviewDto> {
    const totalMembers = await this.memberModel.count();
    const active = await this.memberModel.count({
      where: { suspensionStatus: 'active' },
    });
    const suspended = await this.memberModel.count({
      where: { suspensionStatus: 'suspended' },
    });

    // Count overgrown members
    const overgrownCount = await this.bandMembershipModel.count({
      where: { overgrownFlag: true, isActive: true },
      distinct: true,
      col: 'member_id',
    });

    return {
      totalMembers,
      active,
      overgrown: overgrownCount,
      suspended,
    };
  }

  /**
   * Import members from CSV
   */
  async importMembersFromCsv(fileBase64: string): Promise<{
    success: number;
    failed: number;
    errors: string[];
  }> {
    // Decode base64 file
    const base64Data = fileBase64.replace(/^data:text\/csv;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const csvContent = buffer.toString('utf-8');

    const results: any[] = [];
    const errors: string[] = [];
    let successCount = 0;
    let failedCount = 0;

    return new Promise((resolve) => {
      const stream = Readable.from([csvContent]);
      stream
        .pipe(csv())
        .on('data', async (row) => {
          try {
            // Map CSV columns to member fields
            const memberData: CreateMemberDto = {
              firstName: row.first_name || row['First Name'],
              middleName: row.middle_name || row['Middle Name'],
              surname: row.surname || row['Surname'] || row['Last Name'],
              email: row.email || row['Email'],
              phone: row.phone || row['Phone'],
              gender: (row.gender || row['Gender'] || '').toLowerCase(),
              dob: row.dob || row['Date of Birth'] || row['DOB'],
              maritalStatus: row.marital_status || row['Marital Status'],
              stateOfOrigin: row.state_of_origin || row['State of Origin'],
              country: row.country || row['Country'],
              residentialState:
                row.residential_state || row['Residential State'],
              city: row.city || row['City'],
              lga: row.lga || row['LGA'],
              occupation: row.occupation || row['Occupation'],
              addressLine: row.address_line || row['Address'],
              membershipPath:
                row.membership_path ||
                row['Membership Path'] ||
                (row['Membership Path'] === 'born_in_church'
                  ? 'birth'
                  : row['Membership Path'] === 'adult_intake'
                    ? 'new_convert'
                    : row['Membership Path']),
            };

            // Validate required fields
            if (!memberData.firstName || !memberData.surname) {
              throw new Error('First name and surname are required');
            }

            if (
              !memberData.gender ||
              !['male', 'female'].includes(memberData.gender)
            ) {
              throw new Error('Valid gender (male/female) is required');
            }

            await this.createMember(memberData);
            successCount++;
          } catch (error: any) {
            failedCount++;
            errors.push(`Row ${results.length + 1}: ${error.message}`);
          }
        })
        .on('end', () => {
          resolve({
            success: successCount,
            failed: failedCount,
            errors,
          });
        });
    });
  }

  /**
   * Export members to CSV
   */
  async exportMembersToCsv(query?: MemberQueryDto): Promise<string> {
    const members = await this.getAllMembers({ ...query, limit: 10000 });

    // CSV header
    const headers = [
      'Member Code',
      'First Name',
      'Middle Name',
      'Surname',
      'Email',
      'Phone',
      'Gender',
      'Date of Birth',
      'Age',
      'Marital Status',
      'Occupation',
      'State of Origin',
      'Country',
      'Residential State',
      'City',
      'LGA',
      'Address',
      'Membership Path',
      'Status',
    ];

    // CSV rows
    const rows = members.data.map((member: any) => {
      const age = member.dob
        ? Math.floor(
            (new Date().getTime() - new Date(member.dob).getTime()) /
              (365.25 * 24 * 60 * 60 * 1000),
          )
        : '';
      return [
        member.memberCode || '',
        member.firstName || '',
        member.middleName || '',
        member.surname || '',
        member.email || '',
        member.phone || '',
        member.gender || '',
        member.dob || '',
        age,
        member.maritalStatus || '',
        member.occupation || '',
        member.stateOfOrigin || '',
        member.country || '',
        member.residentialState || '',
        member.city || '',
        member.lga || '',
        member.addressLine || '',
        member.membershipPath || '',
        member.suspensionStatus || '',
      ];
    });

    // Combine headers and rows
    const csvLines = [headers.join(','), ...rows.map((r) => r.join(','))];
    return csvLines.join('\n');
  }
}
