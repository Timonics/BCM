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
  Header,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CommitteesService } from './committees.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectQueryDto } from './dto/project-query.dto';
import { ProjectOverviewResponseDto } from './dto/project-overview-response.dto';
import { ProjectDetailResponseDto } from './dto/project-detail-response.dto';
import { CommitteeOverviewStatsDto } from './dto/committee-overview-stats.dto';
import { CommitteeCompositionRowDto } from './dto/committee-composition-report.dto';
import { LeadershipParticipationRowDto } from './dto/leadership-participation-report.dto';
import { AddCommitteeMemberDto } from './dto/add-committee-member.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('committees')
@ApiBearerAuth('JWT-auth')
@Controller('committees')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class CommitteesController {
  constructor(private readonly committeesService: CommitteesService) {}

  @Post()
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Create a new committee project' })
  @ApiCreatedResponse({ description: 'Project created successfully' })
  async create(@Body() dto: CreateProjectDto) {
    return this.committeesService.create(dto);
  }

  @Get()
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({
    summary: 'Get all committees (projects) with filters',
    description:
      'Filter by name (search), year, projectType, status. Returns list with committee size, leadership count, alerts.',
  })
  @ApiOkResponse({
    description: 'Paginated list of projects',
    type: [ProjectOverviewResponseDto],
  })
  async findAll(@Query() query: ProjectQueryDto) {
    return this.committeesService.findAll(query);
  }

  @Get('overview')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({ summary: 'Get committee overview statistics' })
  @ApiOkResponse({
    description: 'Overview stats',
    type: CommitteeOverviewStatsDto,
  })
  async getOverview() {
    return this.committeesService.getOverview();
  }

  @Get('reports/composition')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({ summary: 'Committee Composition report' })
  @ApiQuery({ name: 'year', required: false })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiQuery({ name: 'roleId', required: false })
  @ApiQuery({ name: 'memberId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiOkResponse({
    description: 'Committee composition rows',
    type: [CommitteeCompositionRowDto],
  })
  async getCompositionReport(
    @Query('year') year?: string,
    @Query('projectId') projectId?: string,
    @Query('roleId') roleId?: string,
    @Query('memberId') memberId?: string,
    @Query('search') search?: string,
  ) {
    return this.committeesService.getCommitteeCompositionReport({
      year: year ? parseInt(year, 10) : undefined,
      projectId,
      roleId,
      memberId,
      search,
    });
  }

  @Get('reports/leadership-participation')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({ summary: 'Leadership Participation report' })
  @ApiQuery({ name: 'year', required: false })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiOkResponse({
    description: 'Leadership participation rows',
    type: [LeadershipParticipationRowDto],
  })
  async getLeadershipParticipationReport(
    @Query('year') year?: string,
    @Query('projectId') projectId?: string,
    @Query('search') search?: string,
  ) {
    return this.committeesService.getLeadershipParticipationReport({
      year: year ? parseInt(year, 10) : undefined,
      projectId,
      search,
    });
  }

  @Get('export/csv')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({ summary: 'Export report as CSV' })
  @ApiQuery({
    name: 'report',
    enum: ['composition', 'leadership-participation'],
    required: true,
  })
  @ApiQuery({ name: 'year', required: false })
  @ApiQuery({ name: 'projectId', required: false })
  @Header('Content-Type', 'text/csv')
  async exportCsv(
    @Res() res: Response,
    @Query('report') report: 'composition' | 'leadership-participation',
    @Query('year') year?: string,
    @Query('projectId') projectId?: string,
  ) {
    const csv = await this.committeesService.exportCsv({
      report,
      year: year ? parseInt(year, 10) : undefined,
      projectId,
    });
    const filename = `committee-report-${report}-${new Date().toISOString().slice(0, 10)}.csv`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  }

  @Get('export/pdf')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({
    summary: 'Export report data for PDF generation',
    description:
      'Returns report data as JSON. Use report=composition or leadership-participation; frontend can generate PDF from this payload.',
  })
  @ApiQuery({
    name: 'report',
    enum: ['composition', 'leadership-participation'],
    required: true,
  })
  @ApiQuery({ name: 'year', required: false })
  @ApiQuery({ name: 'projectId', required: false })
  async exportPdf(
    @Query('report') report: 'composition' | 'leadership-participation',
    @Query('year') year?: string,
    @Query('projectId') projectId?: string,
  ) {
    const filters = {
      year: year ? parseInt(year, 10) : undefined,
      projectId,
    };
    if (report === 'composition') {
      return this.committeesService.getCommitteeCompositionReport(filters);
    }
    return this.committeesService.getLeadershipParticipationReport(filters);
  }

  @Get(':id')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({ summary: 'Get project detail' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    description: 'Project detail',
    type: ProjectDetailResponseDto,
  })
  async findOne(@Param('id') id: string) {
    return this.committeesService.getDetails(id);
  }

  @Patch(':id')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Update project' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ description: 'Project updated' })
  async update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.committeesService.update(id, dto);
  }

  @Patch(':id/complete')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Mark project as completed' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ description: 'Project marked as completed' })
  async markCompleted(@Param('id') id: string) {
    return this.committeesService.markCompleted(id);
  }

  @Delete(':id')
  @Roles('superadmin')
  @ApiOperation({ summary: 'Delete project (superadmin only)' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ description: 'Project deleted' })
  async remove(@Param('id') id: string) {
    return this.committeesService.remove(id);
  }

  @Post(':id/members')
  @Roles('admin', 'superadmin')
  @ApiOperation({
    summary: 'Add member to committee (project)',
    description:
      'Add a member to the committee (plain membership). Assign leadership roles (Chair, Secretary, etc.) via the Leadership module.',
  })
  @ApiParam({ name: 'id', description: 'Project (committee) ID' })
  @ApiCreatedResponse({
    description: 'Member added to committee successfully',
  })
  async addMemberToCommittee(
    @Param('id') id: string,
    @Body() dto: AddCommitteeMemberDto,
  ) {
    return this.committeesService.addMemberToCommittee(id, dto);
  }

  @Get(':id/members')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({
    summary: 'Get committee members',
    description:
      'List all members of the committee (plain membership). Includes leadership role when assigned via the Leadership module.',
  })
  @ApiParam({ name: 'id', description: 'Project (committee) ID' })
  @ApiOkResponse({
    description: 'List of committee members with optional role',
  })
  async getCommitteeMembers(@Param('id') id: string) {
    return this.committeesService.getCommitteeMembers(id);
  }

  @Delete(':id/members/:memberId')
  @Roles('admin', 'superadmin')
  @ApiOperation({
    summary: 'Remove member from committee',
    description:
      'Removes a member from the committee (deactivates membership).',
  })
  @ApiParam({ name: 'id', description: 'Project (committee) ID' })
  @ApiParam({ name: 'memberId', description: 'Member ID' })
  @ApiOkResponse({ description: 'Member removed from committee successfully' })
  async removeMemberFromCommittee(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
  ) {
    return this.committeesService.removeMemberFromCommittee(id, memberId);
  }
}
