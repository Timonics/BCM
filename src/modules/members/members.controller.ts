import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiQuery,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MemberResponseDto } from './dto/member-response.dto';
import { MemberOverviewDto } from './dto/member-overview.dto';
import { CsvImportDto } from './dto/csv-import.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

/**
 * Members Controller
 * Handles all member-related endpoints
 * Requires authentication for all endpoints
 */
@ApiTags('members')
@ApiBearerAuth('JWT-auth')
@Controller('members')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  /**
   * Create a new member
   * Requires admin or superadmin role
   */
  @Post()
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Create a new member' })
  @ApiCreatedResponse({
    description: 'Member created successfully',
    type: MemberResponseDto,
  })
  async createMember(@Body() createMemberDto: CreateMemberDto) {
    return this.membersService.createMember(createMemberDto);
  }

  /**
   * Get all members with pagination and filters
   * Supports search, gender, band, unit, class, and status filters
   */
  @Get()
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({
    summary: 'Get all members',
    description:
      'Retrieve members with pagination, search, and filtering options',
  })
  @ApiOkResponse({
    description: 'List of members',
    type: [MemberResponseDto],
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
    example: 50,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by name, ID, band, or unit',
  })
  @ApiQuery({ name: 'gender', required: false, enum: ['male', 'female'] })
  @ApiQuery({ name: 'bandId', required: false })
  @ApiQuery({ name: 'unitId', required: false })
  @ApiQuery({ name: 'classBatchId', required: false })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['active', 'suspended', 'overgrown'],
  })
  async getAllMembers(
    @Query('page') page = 1,
    @Query('limit') limit = 50,
    @Query('search') search?: string,
    @Query('gender') gender?: 'male' | 'female',
    @Query('bandId') bandId?: string,
    @Query('unitId') unitId?: string,
    @Query('classBatchId') classBatchId?: string,
    @Query('status') status?: 'active' | 'suspended' | 'overgrown',
  ) {
    return this.membersService.getAllMembers({
      page,
      limit,
      search,
      gender,
      bandId,
      unitId,
      classBatchId,
      status,
    });
  }

  /**
   * Get member overview statistics
   * Returns total, active, overgrown, and suspended counts
   */
  @Get('overview')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({ summary: 'Get member overview statistics' })
  @ApiOkResponse({
    description: 'Member overview statistics',
    type: MemberOverviewDto,
  })
  async getMembersOverview() {
    return this.membersService.getMembersOverview();
  }

  /**
   * Get a single member by ID
   */
  @Get(':id')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({ summary: 'Get a member by ID' })
  @ApiParam({ name: 'id', description: 'Member ID' })
  @ApiOkResponse({
    description: 'Member details',
    type: MemberResponseDto,
  })
  async getMemberById(@Param('id') id: string) {
    return this.membersService.getMemberById(id);
  }

  /**
   * Update a member
   * Requires admin or superadmin role
   */
  @Patch(':id')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Update a member' })
  @ApiParam({ name: 'id', description: 'Member ID' })
  @ApiOkResponse({
    description: 'Member updated successfully',
    type: MemberResponseDto,
  })
  async updateMember(
    @Param('id') id: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    return this.membersService.updateMember(id, updateMemberDto);
  }

  /**
   * Delete a member
   * Only superadmin can delete
   */
  @Delete(':id')
  @Roles('superadmin')
  @ApiOperation({ summary: 'Delete a member (superadmin only)' })
  @ApiParam({ name: 'id', description: 'Member ID' })
  @ApiResponse({ status: 204, description: 'Member deleted successfully' })
  async deleteMember(@Param('id') id: string) {
    await this.membersService.deleteMember(id);
    return { message: 'Member deleted successfully' };
  }

  /**
   * Import members from CSV
   * Accepts base64 encoded CSV file
   */
  @Post('import')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Import members from CSV file' })
  @ApiCreatedResponse({
    description: 'CSV import completed',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'number' },
        failed: { type: 'number' },
        errors: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  async importMembersFromCsv(@Body() csvImportDto: CsvImportDto) {
    return this.membersService.importMembersFromCsv(csvImportDto.fileBase64);
  }

  /**
   * Export members to CSV
   * Supports filtering via query parameters
   */
  @Get('export/csv')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({ summary: 'Export members to CSV file' })
  @ApiOkResponse({
    description: 'CSV file download',
    content: {
      'text/csv': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  async exportMembersToCsv(
    @Res() res: Response,
    @Query('page') page = 1,
    @Query('limit') limit = 50,
    @Query('search') search?: string,
    @Query('gender') gender?: 'male' | 'female',
    @Query('bandId') bandId?: string,
    @Query('unitId') unitId?: string,
    @Query('classBatchId') classBatchId?: string,
    @Query('status') status?: 'active' | 'suspended' | 'overgrown',
  ) {
    const csv = await this.membersService.exportMembersToCsv({
      page,
      limit,
      search,
      gender,
      bandId,
      unitId,
      classBatchId,
      status,
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=members.csv');
    res.send(csv);
  }
}
