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
  Res,
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
import { Response } from 'express';
import { LeadershipService } from './leadership.service';
import { CreateLeadershipRoleDto } from './dto/create-leadership-role.dto';
import { UpdateLeadershipRoleDto } from './dto/update-leadership-role.dto';
import { AssignLeadershipDto } from './dto/assign-leadership.dto';
import { UpdateLeadershipAssignmentDto } from './dto/update-leadership-assignment.dto';
import { LeadershipQueryDto } from './dto/leadership-query.dto';
import { LeadershipOverviewResponseDto } from './dto/leadership-overview-response.dto';
import { LeadershipRoleResponseDto } from './dto/leadership-role-response.dto';
import { LeadershipAssignmentResponseDto } from './dto/leadership-assignment-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('leadership')
@ApiBearerAuth('JWT-auth')
@Controller('leadership')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class LeadershipController {
  constructor(private readonly leadershipService: LeadershipService) {}

  // ==================== OVERVIEW & STATISTICS ====================

  @Get('overview')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({
    summary: 'Get leadership overview statistics',
    description:
      'Returns total active leaders, roles expiring soon, vacant positions, and expired positions',
  })
  @ApiOkResponse({
    description: 'Leadership overview statistics',
    type: LeadershipOverviewResponseDto,
  })
  async getLeadershipOverview() {
    return this.leadershipService.getLeadershipOverview();
  }

  // ==================== LEADERSHIP ROLE TEMPLATES ====================

  @Get('roles')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({
    summary: 'Get all leadership role templates',
    description:
      'Returns list of all leadership role templates, optionally filtered by category',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description:
      'Filter by category (SIC, BAND, UNIT, CLASS, COMMITTEE, DEPARTMENT)',
    enum: ['SIC', 'BAND', 'UNIT', 'CLASS', 'COMMITTEE', 'DEPARTMENT'],
  })
  @ApiOkResponse({
    description: 'List of leadership role templates',
    type: [LeadershipRoleResponseDto],
  })
  async getAllLeadershipRoles(@Query('category') category?: string) {
    return this.leadershipService.getAllLeadershipRoles(category);
  }

  @Get('roles/:id')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({
    summary: 'Get leadership role template by ID',
  })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    description: 'Leadership role template details',
    type: LeadershipRoleResponseDto,
  })
  async getLeadershipRoleById(@Param('id') id: string) {
    return this.leadershipService.getLeadershipRoleById(id);
  }

  @Post('roles')
  @Roles('admin', 'superadmin')
  @ApiOperation({
    summary: 'Create a new leadership role template',
    description:
      'Creates a reusable leadership role template that can be assigned to members',
  })
  @ApiCreatedResponse({
    description: 'Leadership role template created successfully',
  })
  async createLeadershipRole(@Body() createDto: CreateLeadershipRoleDto) {
    return this.leadershipService.createLeadershipRole(createDto);
  }

  @Patch('roles/:id')
  @Roles('admin', 'superadmin')
  @ApiOperation({
    summary: 'Update a leadership role template',
  })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    description: 'Leadership role template updated successfully',
  })
  async updateLeadershipRole(
    @Param('id') id: string,
    @Body() updateDto: UpdateLeadershipRoleDto,
  ) {
    return this.leadershipService.updateLeadershipRole(id, updateDto);
  }

  @Delete('roles/:id')
  @Roles('superadmin')
  @ApiOperation({
    summary: 'Delete a leadership role template (superadmin only)',
    description:
      'Deletes a role template. Cannot delete if there are active assignments.',
  })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    description: 'Leadership role template deleted successfully',
  })
  async deleteLeadershipRole(@Param('id') id: string) {
    await this.leadershipService.deleteLeadershipRole(id);
    return { message: 'Leadership role template deleted successfully' };
  }

  // ==================== LEADERSHIP ASSIGNMENTS ====================

  @Get('assignments')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({
    summary: 'Get all leadership assignments',
    description:
      'Returns paginated list of leadership assignments with search and filter capabilities',
  })
  @ApiOkResponse({
    description: 'List of leadership assignments',
    type: [LeadershipAssignmentResponseDto],
  })
  async getAllLeadershipAssignments(@Query() queryDto: LeadershipQueryDto) {
    return this.leadershipService.getAllLeadershipAssignments(queryDto);
  }

  @Get('assignments/:id')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({
    summary: 'Get leadership assignment by ID',
  })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    description: 'Leadership assignment details',
    type: LeadershipAssignmentResponseDto,
  })
  async getLeadershipAssignmentById(@Param('id') id: string) {
    return this.leadershipService.getLeadershipAssignmentById(id);
  }

  @Post('assignments')
  @Roles('admin', 'superadmin')
  @ApiOperation({
    summary: 'Assign a leadership role to a member',
    description:
      'Assigns a leadership role to a member with scope and tenure information',
  })
  @ApiCreatedResponse({
    description: 'Leadership assignment created successfully',
  })
  async assignLeadership(@Body() assignDto: AssignLeadershipDto) {
    return this.leadershipService.assignLeadership(assignDto);
  }

  @Patch('assignments/:id')
  @Roles('admin', 'superadmin')
  @ApiOperation({
    summary: 'Update a leadership assignment',
    description:
      'Updates member, dates, status, or end reason for a leadership assignment',
  })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    description: 'Leadership assignment updated successfully',
  })
  async updateLeadershipAssignment(
    @Param('id') id: string,
    @Body() updateDto: UpdateLeadershipAssignmentDto,
  ) {
    return this.leadershipService.updateLeadershipAssignment(id, updateDto);
  }

  @Delete('assignments/:id')
  @Roles('superadmin')
  @ApiOperation({
    summary: 'Delete a leadership assignment (superadmin only)',
  })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    description: 'Leadership assignment deleted successfully',
  })
  async deleteLeadershipAssignment(@Param('id') id: string) {
    await this.leadershipService.deleteLeadershipAssignment(id);
    return { message: 'Leadership assignment deleted successfully' };
  }

  // ==================== EXPORT ====================

  @Get('export')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({
    summary: 'Export leadership assignments to CSV',
    description:
      'Exports leadership assignments to CSV format with optional filtering',
  })
  @ApiOkResponse({
    description: 'CSV file download',
    content: {
      'text/csv': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  async exportLeadershipAssignments(
    @Query() queryDto: LeadershipQueryDto,
    @Res() res: Response,
  ) {
    const csvContent =
      await this.leadershipService.exportLeadershipAssignments(queryDto);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="leadership-assignments-${Date.now()}.csv"`,
    );
    res.send(csvContent);
  }
}
