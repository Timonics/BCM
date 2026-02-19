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
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { AddUnitMemberDto } from './dto/add-unit-member.dto';
import { AssignUnitLeadershipDto } from './dto/assign-unit-leadership.dto';
import { UnitOverviewResponseDto } from './dto/unit-overview-response.dto';
import { UnitDetailResponseDto } from './dto/unit-detail-response.dto';
import { UnitLeadershipResponseDto } from './dto/unit-leadership-response.dto';
import { UnitMemberResponseDto } from './dto/unit-member-response.dto';
import { UnitOverviewStatsDto } from './dto/unit-overview-stats.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('units')
@ApiBearerAuth('JWT-auth')
@Controller('units')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Create a new unit' })
  @ApiCreatedResponse({ description: 'Unit created successfully' })
  async createUnit(@Body() createUnitDto: CreateUnitDto) {
    return this.unitsService.createUnit(createUnitDto);
  }

  @Get()
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({
    summary: 'Get all units with overview statistics',
    description:
      'Returns list of units with overview (total members, active members, inactive members, coordinator). Use GET /units/:id for detailed membership information.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by unit name or code',
  })
  @ApiOkResponse({
    description: 'List of units with overview statistics',
    type: [UnitOverviewResponseDto],
  })
  async getAllUnits(@Query('search') search?: string) {
    return this.unitsService.getAllUnits(search);
  }

  @Get('overview')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({ summary: 'Get units overview statistics' })
  @ApiOkResponse({
    description: 'Units overview statistics',
    type: UnitOverviewStatsDto,
  })
  async getUnitsOverview() {
    return this.unitsService.getUnitsOverview();
  }

  @Get(':id')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({ summary: 'Get unit details with coordinator information' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    description: 'Unit details with coordinator and statistics',
    type: UnitDetailResponseDto,
  })
  async getUnitById(@Param('id') id: string) {
    return this.unitsService.getUnitDetails(id);
  }

  @Get(':id/leadership')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({ summary: 'Get unit leadership team' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    description: 'List of unit leadership team members',
    type: [UnitLeadershipResponseDto],
  })
  async getUnitLeadershipTeam(@Param('id') id: string) {
    return this.unitsService.getUnitLeadershipTeam(id);
  }

  @Get(':id/members')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({ summary: 'Get unit members with detailed information' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    description: 'List of unit members with details',
    type: [UnitMemberResponseDto],
  })
  async getUnitMembers(@Param('id') id: string) {
    return this.unitsService.getUnitMembers(id);
  }

  @Patch(':id')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Update unit' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ description: 'Unit updated successfully' })
  async updateUnit(
    @Param('id') id: string,
    @Body() updateUnitDto: UpdateUnitDto,
  ) {
    return this.unitsService.updateUnit(id, updateUnitDto);
  }

  @Delete(':id')
  @Roles('superadmin')
  @ApiOperation({ summary: 'Delete unit (superadmin only)' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ description: 'Unit deleted successfully' })
  async deleteUnit(@Param('id') id: string) {
    return this.unitsService.deleteUnit(id);
  }

  @Post(':id/members')
  @Roles('admin', 'superadmin')
  @ApiOperation({
    summary: 'Add member to unit',
    description:
      'Add a member to a unit. Members can belong to multiple units simultaneously.',
  })
  @ApiParam({ name: 'id' })
  @ApiCreatedResponse({ description: 'Member added to unit successfully' })
  async addMemberToUnit(
    @Param('id') id: string,
    @Body() addMemberDto: AddUnitMemberDto,
  ) {
    return this.unitsService.addMemberToUnit(id, addMemberDto);
  }

  @Delete(':id/members/:memberId')
  @Roles('admin', 'superadmin')
  @ApiOperation({
    summary: 'Remove member from unit',
    description:
      'Removes a member from the unit by deactivating their membership.',
  })
  @ApiParam({ name: 'id', description: 'Unit ID' })
  @ApiParam({ name: 'memberId', description: 'Member ID' })
  @ApiOkResponse({ description: 'Member removed from unit successfully' })
  async removeMemberFromUnit(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
  ) {
    return this.unitsService.removeMemberFromUnit(id, memberId);
  }

  @Post(':id/leadership')
  @Roles('admin', 'superadmin')
  @ApiOperation({
    summary: 'Assign unit leadership role',
    description:
      'Assign a member to a unit leadership role (Head of Unit, Assistant Head, or Secretary). The member must be an active member of the unit.',
  })
  @ApiParam({ name: 'id' })
  @ApiCreatedResponse({ description: 'Leadership role assigned successfully' })
  async assignUnitLeadership(
    @Param('id') id: string,
    @Body() assignDto: AssignUnitLeadershipDto,
  ) {
    return this.unitsService.assignUnitLeadership(id, assignDto);
  }
}
