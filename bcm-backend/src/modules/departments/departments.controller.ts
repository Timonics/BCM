import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { AddDepartmentMemberDto } from './dto/add-department-member.dto';
import { CreateUnitDto } from '../units/dto/create-unit.dto';
import { DepartmentOverviewResponseDto } from './dto/department-overview-response.dto';
import { DepartmentOverviewStatsDto } from './dto/department-overview-stats.dto';
import { DepartmentDetailResponseDto } from './dto/department-detail-response.dto';
import { DepartmentUnitResponseDto } from './dto/department-unit-response.dto';
import { DepartmentMemberResponseDto } from './dto/department-member-response.dto';
import { DepartmentLeadershipResponseDto } from './dto/department-leadership-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('departments')
@ApiBearerAuth('JWT-auth')
@Controller('departments')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Create a new department' })
  @ApiCreatedResponse({ description: 'Department created successfully' })
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentsService.create(createDepartmentDto);
  }

  @Get()
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({
    summary: 'Get all departments with overview statistics',
    description:
      'Returns list of departments with overview (total members, units, head, alerts). Use GET /departments/:id for full detail.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by department name or description',
  })
  @ApiOkResponse({
    description: 'List of departments with overview statistics',
    type: [DepartmentOverviewResponseDto],
  })
  async findAll(@Query('search') search?: string) {
    return this.departmentsService.findAll(search);
  }

  @Get('overview')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({ summary: 'Get departments overview statistics' })
  @ApiOkResponse({
    description: 'Departments overview statistics',
    type: DepartmentOverviewStatsDto,
  })
  async getOverview() {
    return this.departmentsService.getOverview();
  }

  @Get(':id')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({ summary: 'Get department details (overview tab data)' })
  @ApiParam({ name: 'id', description: 'Department ID' })
  @ApiOkResponse({
    description: 'Department details with stats',
    type: DepartmentDetailResponseDto,
  })
  async findOne(@Param('id') id: string) {
    return this.departmentsService.getDetails(id);
  }

  @Get(':id/units')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({ summary: 'Get department units (units tab)' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    description: 'List of units in the department',
    type: [DepartmentUnitResponseDto],
  })
  async getUnits(@Param('id') id: string) {
    return this.departmentsService.getUnits(id);
  }

  @Get(':id/members')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({ summary: 'Get department members (members tab)' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    description: 'List of members in the department (across all units)',
    type: [DepartmentMemberResponseDto],
  })
  async getMembers(@Param('id') id: string) {
    return this.departmentsService.getMembers(id);
  }

  @Get(':id/leadership')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({ summary: 'Get department leadership (leadership tab)' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    description: 'List of department leadership assignments',
    type: [DepartmentLeadershipResponseDto],
  })
  async getLeadership(@Param('id') id: string) {
    return this.departmentsService.getLeadership(id);
  }

  @Patch(':id')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Update department' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ description: 'Department updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentsService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  @Roles('superadmin')
  @ApiOperation({ summary: 'Delete department (superadmin only)' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ description: 'Department deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.departmentsService.remove(id);
  }

  @Post(':id/members')
  @Roles('admin', 'superadmin')
  @ApiOperation({
    summary: 'Add member to department',
    description:
      'Add a member to a unit within the department. Provide memberId and unitId (unit must belong to this department).',
  })
  @ApiParam({ name: 'id' })
  @ApiCreatedResponse({
    description: 'Member added to department unit successfully',
  })
  async addMember(
    @Param('id') id: string,
    @Body() dto: AddDepartmentMemberDto,
  ) {
    return this.departmentsService.addMember(id, dto);
  }

  @Post(':id/units')
  @Roles('admin', 'superadmin')
  @ApiOperation({
    summary: 'Add unit to department',
    description: 'Create a new unit under this department.',
  })
  @ApiParam({ name: 'id' })
  @ApiCreatedResponse({
    description: 'Unit created and assigned to department',
  })
  async addUnit(@Param('id') id: string, @Body() createUnitDto: CreateUnitDto) {
    return this.departmentsService.addUnit(id, createUnitDto);
  }
}
