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
import { ClassesService } from './classes.service';
import { CreateClassBatchDto } from './dto/create-class-batch.dto';
import { UpdateClassBatchDto } from './dto/update-class-batch.dto';
import { AddClassMemberDto } from './dto/add-class-member.dto';
import { AssignClassLeadershipDto } from './dto/assign-class-leadership.dto';
import { ApproveEnrollmentDto } from './dto/approve-enrollment.dto';
import { MarkReadyDto } from './dto/mark-ready.dto';
import { UpdateEnrollmentStatusDto } from './dto/update-enrollment-status.dto';
import { UpdateBatchStatusDto } from './dto/update-batch-status.dto';
import { ClassOverviewResponseDto } from './dto/class-overview-response.dto';
import { ClassBatchOverviewDto } from './dto/class-batch-overview.dto';
import { ClassBatchDetailDto } from './dto/class-batch-detail.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('classes')
@ApiBearerAuth('JWT-auth')
@Controller('classes')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  // ==================== PRE-YOUTH CLASS ENDPOINTS ====================

  @Get('pre-youth/overview')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({
    summary: 'Get Pre-Youth class overview statistics',
    description:
      'Returns active batches, members in class, ready for graduation, and pending approvals',
  })
  @ApiOkResponse({
    description: 'Pre-Youth class overview statistics',
    type: ClassOverviewResponseDto,
  })
  async getPreYouthOverview() {
    return this.classesService.getClassOverview('PREYOUTH');
  }

  @Get('pre-youth/batches')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({
    summary: 'Get all Pre-Youth class batches',
    description:
      'Returns list of Pre-Youth batches with overview information (status, year, members, leadership, ready to graduate, completion rate, readiness status, dates, coordinator, attendance)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by batch code or description',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by status',
  })
  @ApiQuery({ name: 'year', required: false, description: 'Filter by year' })
  @ApiOkResponse({
    description: 'List of Pre-Youth class batches',
    type: [ClassBatchOverviewDto],
  })
  async getAllPreYouthBatches(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('year') year?: number,
  ) {
    return this.classesService.getAllClassBatches(
      'PREYOUTH',
      search,
      status,
      year,
    );
  }

  @Get('pre-youth/batches/:id')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({
    summary: 'Get Pre-Youth batch details',
    description:
      'Returns detailed information including status, dates, year, active members, ready for graduation, gender distribution, average attendance, leadership, graduation readiness, and member list',
  })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    description: 'Pre-Youth batch details',
    type: ClassBatchDetailDto,
  })
  async getPreYouthBatchDetails(@Param('id') id: string) {
    return this.classesService.getClassBatchDetails(id);
  }

  @Post('pre-youth/batches')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Create Pre-Youth batch (annual)' })
  @ApiCreatedResponse({ description: 'Pre-Youth batch created successfully' })
  async createPreYouthBatch(@Body() createDto: CreateClassBatchDto) {
    createDto.classTypeCode = 'PREYOUTH';
    return this.classesService.createClassBatch(createDto);
  }

  @Patch('pre-youth/batches/:id')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Update Pre-Youth batch' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ description: 'Pre-Youth batch updated successfully' })
  async updatePreYouthBatch(
    @Param('id') id: string,
    @Body() updateDto: UpdateClassBatchDto,
  ) {
    return this.classesService.updateClassBatch(id, updateDto);
  }

  @Patch('pre-youth/batches/:id/status')
  @Roles('admin', 'superadmin')
  @ApiOperation({
    summary: 'Update Pre-Youth batch status',
    description: 'Update batch status (not_started -> started -> completed)',
  })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ description: 'Batch status updated successfully' })
  async updatePreYouthBatchStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateBatchStatusDto,
  ) {
    return this.classesService.updateClassBatch(id, {
      status: updateDto.status,
    });
  }

  @Delete('pre-youth/batches/:id')
  @Roles('superadmin')
  @ApiOperation({ summary: 'Delete Pre-Youth batch (superadmin only)' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ description: 'Pre-Youth batch deleted successfully' })
  async deletePreYouthBatch(@Param('id') id: string) {
    await this.classesService.deleteClassBatch(id);
    return { message: 'Pre-Youth batch deleted successfully' };
  }

  @Post('pre-youth/batches/:id/members')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Add member to Pre-Youth batch' })
  @ApiParam({ name: 'id' })
  @ApiCreatedResponse({ description: 'Member added to batch successfully' })
  async addMemberToPreYouthBatch(
    @Param('id') id: string,
    @Body() addMemberDto: AddClassMemberDto,
  ) {
    return this.classesService.addMemberToBatch(id, addMemberDto);
  }

  @Delete('pre-youth/batches/:batchId/members/:memberId')
  @Roles('admin', 'superadmin')
  @ApiOperation({
    summary: 'Remove member from Pre-Youth batch',
    description:
      'Removes a member from the batch. Cannot remove members who have completed and graduated.',
  })
  @ApiParam({ name: 'batchId', description: 'Batch ID' })
  @ApiParam({ name: 'memberId', description: 'Member ID' })
  @ApiOkResponse({ description: 'Member removed from batch successfully' })
  async removeMemberFromPreYouthBatch(
    @Param('batchId') batchId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.classesService.removeMemberFromBatch(batchId, memberId);
  }

  @Post('pre-youth/batches/:id/leadership')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Assign leadership to Pre-Youth batch' })
  @ApiParam({ name: 'id' })
  @ApiCreatedResponse({ description: 'Leadership assigned successfully' })
  async assignPreYouthLeadership(
    @Param('id') id: string,
    @Body() assignDto: AssignClassLeadershipDto,
  ) {
    return this.classesService.assignClassLeadership(id, assignDto);
  }

  @Patch('pre-youth/batches/:batchId/members/:memberId')
  @Roles('admin', 'superadmin')
  @ApiOperation({
    summary: 'Update Pre-Youth enrollment status by member ID',
    description:
      'Update graduation status, attendance, or enrollment status for a specific Pre-Youth member in a batch',
  })
  @ApiParam({ name: 'batchId', description: 'Batch ID' })
  @ApiParam({ name: 'memberId', description: 'Member ID' })
  @ApiOkResponse({ description: 'Enrollment status updated successfully' })
  async updatePreYouthEnrollmentStatusByMember(
    @Param('batchId') batchId: string,
    @Param('memberId') memberId: string,
    @Body() updateDto: UpdateEnrollmentStatusDto,
  ) {
    return this.classesService.updateEnrollmentStatusByMember(
      batchId,
      memberId,
      updateDto,
    );
  }

  @Patch('pre-youth/enrollments/:enrollmentId')
  @Roles('admin', 'superadmin')
  @ApiOperation({
    summary: 'Update Pre-Youth enrollment status by enrollment ID',
    description:
      'Update graduation status, attendance, or enrollment status for Pre-Youth members using enrollment ID',
  })
  @ApiParam({ name: 'enrollmentId' })
  @ApiOkResponse({ description: 'Enrollment status updated successfully' })
  async updatePreYouthEnrollmentStatus(
    @Param('enrollmentId') enrollmentId: string,
    @Body() updateDto: UpdateEnrollmentStatusDto,
  ) {
    return this.classesService.updateEnrollmentStatus(enrollmentId, updateDto);
  }

  @Post('pre-youth/batches/:id/approve')
  @Roles('admin', 'superadmin')
  @ApiOperation({
    summary: 'Approve Pre-Youth enrollments (mark as ready for graduation)',
    description:
      'Mark Pre-Youth members as ready for graduation. This updates their graduation status to "ready". Can approve specific members (by memberIds) or all pending.',
  })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ description: 'Enrollments approved successfully' })
  async approvePreYouthEnrollments(
    @Param('id') id: string,
    @Body() approveDto: ApproveEnrollmentDto,
  ) {
    return this.classesService.approvePreYouthEnrollments(
      id,
      approveDto.memberIds,
      approveDto.enrollmentIds,
    );
  }

  // ==================== BAPTISMAL CLASS ENDPOINTS ====================

  @Get('baptismal/overview')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({
    summary: 'Get Baptismal class overview statistics',
    description:
      'Returns active batches, total members in classes, ready for graduation, and pending approvals',
  })
  @ApiOkResponse({
    description: 'Baptismal class overview statistics',
    type: ClassOverviewResponseDto,
  })
  async getBaptismalOverview() {
    return this.classesService.getClassOverview('BAPTISMAL');
  }

  @Get('baptismal/batches')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({
    summary: 'Get all Baptismal class batches',
    description:
      'Returns list of Baptismal batches (biannual - January and August) with details including start/end date, members enrolled, completion progress, status, leadership, and graduation details',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by batch code or description',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by status',
  })
  @ApiQuery({ name: 'year', required: false, description: 'Filter by year' })
  @ApiOkResponse({
    description: 'List of Baptismal class batches',
    type: [ClassBatchOverviewDto],
  })
  async getAllBaptismalBatches(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('year') year?: number,
  ) {
    return this.classesService.getAllClassBatches(
      'BAPTISMAL',
      search,
      status,
      year,
    );
  }

  @Get('baptismal/batches/:id')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({
    summary: 'Get Baptismal batch details',
    description:
      'Returns detailed information including total members, pending approval, approved, average attendance, batch leadership, approval management, and all members with enrollment, attendance, and approval status',
  })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    description: 'Baptismal batch details',
    type: ClassBatchDetailDto,
  })
  async getBaptismalBatchDetails(@Param('id') id: string) {
    return this.classesService.getClassBatchDetails(id);
  }

  @Post('baptismal/batches')
  @Roles('admin', 'superadmin')
  @ApiOperation({
    summary: 'Create Baptismal batch (biannual - January or August)',
  })
  @ApiCreatedResponse({ description: 'Baptismal batch created successfully' })
  async createBaptismalBatch(@Body() createDto: CreateClassBatchDto) {
    createDto.classTypeCode = 'BAPTISMAL';
    return this.classesService.createClassBatch(createDto);
  }

  @Patch('baptismal/batches/:id')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Update Baptismal batch' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ description: 'Baptismal batch updated successfully' })
  async updateBaptismalBatch(
    @Param('id') id: string,
    @Body() updateDto: UpdateClassBatchDto,
  ) {
    return this.classesService.updateClassBatch(id, updateDto);
  }

  @Patch('baptismal/batches/:id/status')
  @Roles('admin', 'superadmin')
  @ApiOperation({
    summary: 'Update Baptismal batch status',
    description: 'Update batch status (not_started -> started -> completed)',
  })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ description: 'Batch status updated successfully' })
  async updateBaptismalBatchStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateBatchStatusDto,
  ) {
    return this.classesService.updateClassBatch(id, {
      status: updateDto.status,
    });
  }

  @Delete('baptismal/batches/:id')
  @Roles('superadmin')
  @ApiOperation({ summary: 'Delete Baptismal batch (superadmin only)' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ description: 'Baptismal batch deleted successfully' })
  async deleteBaptismalBatch(@Param('id') id: string) {
    await this.classesService.deleteClassBatch(id);
    return { message: 'Baptismal batch deleted successfully' };
  }

  @Post('baptismal/batches/:id/members')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Add member to Baptismal batch' })
  @ApiParam({ name: 'id' })
  @ApiCreatedResponse({ description: 'Member added to batch successfully' })
  async addMemberToBaptismalBatch(
    @Param('id') id: string,
    @Body() addMemberDto: AddClassMemberDto,
  ) {
    return this.classesService.addMemberToBatch(id, addMemberDto);
  }

  @Delete('baptismal/batches/:batchId/members/:memberId')
  @Roles('admin', 'superadmin')
  @ApiOperation({
    summary: 'Remove member from Baptismal batch',
    description:
      'Removes a member from the batch. Cannot remove members who have completed and graduated.',
  })
  @ApiParam({ name: 'batchId', description: 'Batch ID' })
  @ApiParam({ name: 'memberId', description: 'Member ID' })
  @ApiOkResponse({ description: 'Member removed from batch successfully' })
  async removeMemberFromBaptismalBatch(
    @Param('batchId') batchId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.classesService.removeMemberFromBatch(batchId, memberId);
  }

  @Post('baptismal/batches/:id/approve')
  @Roles('admin', 'superadmin')
  @ApiOperation({
    summary: 'Approve or fail Baptismal enrollments',
    description:
      'Approve enrollments (auto-migrates to ETS) or fail and roll over to next batch. Supports approve, approve_all, fail, fail_all actions',
  })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ description: 'Enrollments processed successfully' })
  async approveBaptismalEnrollments(
    @Param('id') id: string,
    @Body() approveDto: ApproveEnrollmentDto,
  ) {
    return this.classesService.approveEnrollments(id, approveDto);
  }

  @Patch('baptismal/batches/:batchId/members/:memberId')
  @Roles('admin', 'superadmin')
  @ApiOperation({
    summary: 'Update Baptismal enrollment status by member ID',
    description:
      'Update graduation status, attendance, or enrollment status for a specific Baptismal member in a batch',
  })
  @ApiParam({ name: 'batchId', description: 'Batch ID' })
  @ApiParam({ name: 'memberId', description: 'Member ID' })
  @ApiOkResponse({ description: 'Enrollment status updated successfully' })
  async updateBaptismalEnrollmentStatusByMember(
    @Param('batchId') batchId: string,
    @Param('memberId') memberId: string,
    @Body() updateDto: UpdateEnrollmentStatusDto,
  ) {
    return this.classesService.updateEnrollmentStatusByMember(
      batchId,
      memberId,
      updateDto,
    );
  }

  @Post('baptismal/batches/:id/mark-ready')
  @Roles('admin', 'superadmin')
  @ApiOperation({
    summary: 'Mark Baptismal members as ready for graduation',
    description:
      'Mark Baptismal members as ready for graduation. This updates their graduation status to "ready". Can mark specific members (by memberIds) or all approved members. Note: This is different from approval - it marks already approved members as ready for graduation.',
  })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    description: 'Members marked as ready for graduation successfully',
  })
  async markBaptismalMembersReady(
    @Param('id') id: string,
    @Body() markReadyDto: MarkReadyDto,
  ) {
    return this.classesService.markBaptismalMembersReady(
      id,
      markReadyDto.memberIds,
      markReadyDto.enrollmentIds,
    );
  }

  @Post('baptismal/batches/:id/leadership')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Assign leadership to Baptismal batch' })
  @ApiParam({ name: 'id' })
  @ApiCreatedResponse({ description: 'Leadership assigned successfully' })
  async assignBaptismalLeadership(
    @Param('id') id: string,
    @Body() assignDto: AssignClassLeadershipDto,
  ) {
    return this.classesService.assignClassLeadership(id, assignDto);
  }

  // ==================== ETS CLASS ENDPOINTS ====================

  @Get('ets/overview')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({
    summary: 'Get ETS class overview statistics',
    description:
      'Returns active batches, members in class, ready for graduation, and pending approvals',
  })
  @ApiOkResponse({
    description: 'ETS class overview statistics',
    type: ClassOverviewResponseDto,
  })
  async getETSOverview() {
    return this.classesService.getClassOverview('ETS');
  }

  @Get('ets/batches')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({
    summary: 'Get all ETS class batches',
    description:
      'Returns list of ETS batches (biannual - January and August) with status, start/end date, members enrolled, pending approval and band eligibility statuses, completion rate, status, and total graduated',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by batch code or description',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by status',
  })
  @ApiQuery({ name: 'year', required: false, description: 'Filter by year' })
  @ApiOkResponse({
    description: 'List of ETS class batches',
    type: [ClassBatchOverviewDto],
  })
  async getAllETSBatches(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('year') year?: number,
  ) {
    return this.classesService.getAllClassBatches('ETS', search, status, year);
  }

  @Get('ets/batches/:id')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({
    summary: 'Get ETS batch details',
    description:
      'Returns detailed information including batch information and timeline, members list with approval status, band eligibility tracking, pending approvals management, leadership assignments, and completion progress',
  })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    description: 'ETS batch details',
    type: ClassBatchDetailDto,
  })
  async getETSBatchDetails(@Param('id') id: string) {
    return this.classesService.getClassBatchDetails(id);
  }

  @Post('ets/batches')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Create ETS batch (biannual - January or August)' })
  @ApiCreatedResponse({ description: 'ETS batch created successfully' })
  async createETSBatch(@Body() createDto: CreateClassBatchDto) {
    createDto.classTypeCode = 'ETS';
    return this.classesService.createClassBatch(createDto);
  }

  @Patch('ets/batches/:id')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Update ETS batch' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ description: 'ETS batch updated successfully' })
  async updateETSBatch(
    @Param('id') id: string,
    @Body() updateDto: UpdateClassBatchDto,
  ) {
    return this.classesService.updateClassBatch(id, updateDto);
  }

  @Patch('ets/batches/:id/status')
  @Roles('admin', 'superadmin')
  @ApiOperation({
    summary: 'Update ETS batch status',
    description: 'Update batch status (not_started -> started -> completed)',
  })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ description: 'Batch status updated successfully' })
  async updateETSBatchStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateBatchStatusDto,
  ) {
    return this.classesService.updateClassBatch(id, {
      status: updateDto.status,
    });
  }

  @Delete('ets/batches/:id')
  @Roles('superadmin')
  @ApiOperation({ summary: 'Delete ETS batch (superadmin only)' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ description: 'ETS batch deleted successfully' })
  async deleteETSBatch(@Param('id') id: string) {
    await this.classesService.deleteClassBatch(id);
    return { message: 'ETS batch deleted successfully' };
  }

  @Post('ets/batches/:id/members')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Add member to ETS batch' })
  @ApiParam({ name: 'id' })
  @ApiCreatedResponse({ description: 'Member added to batch successfully' })
  async addMemberToETSBatch(
    @Param('id') id: string,
    @Body() addMemberDto: AddClassMemberDto,
  ) {
    return this.classesService.addMemberToBatch(id, addMemberDto);
  }

  @Delete('ets/batches/:batchId/members/:memberId')
  @Roles('admin', 'superadmin')
  @ApiOperation({
    summary: 'Remove member from ETS batch',
    description:
      'Removes a member from the batch. Cannot remove members who have completed and graduated.',
  })
  @ApiParam({ name: 'batchId', description: 'Batch ID' })
  @ApiParam({ name: 'memberId', description: 'Member ID' })
  @ApiOkResponse({ description: 'Member removed from batch successfully' })
  async removeMemberFromETSBatch(
    @Param('batchId') batchId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.classesService.removeMemberFromBatch(batchId, memberId);
  }

  @Post('ets/batches/:id/approve')
  @Roles('admin', 'superadmin')
  @ApiOperation({
    summary: 'Approve or fail ETS enrollments',
    description:
      'Approve or fail enrollments. Supports approve, approve_all, fail, fail_all actions',
  })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ description: 'Enrollments processed successfully' })
  async approveETSEnrollments(
    @Param('id') id: string,
    @Body() approveDto: ApproveEnrollmentDto,
  ) {
    return this.classesService.approveEnrollments(id, approveDto);
  }

  @Patch('ets/batches/:batchId/members/:memberId')
  @Roles('admin', 'superadmin')
  @ApiOperation({
    summary: 'Update ETS enrollment status by member ID',
    description:
      'Update graduation status, attendance, band eligibility, or enrollment status for a specific ETS member in a batch. Setting graduationStatus to "ready" automatically sets bandEligible to true.',
  })
  @ApiParam({ name: 'batchId', description: 'Batch ID' })
  @ApiParam({ name: 'memberId', description: 'Member ID' })
  @ApiOkResponse({ description: 'Enrollment status updated successfully' })
  async updateETSEnrollmentStatusByMember(
    @Param('batchId') batchId: string,
    @Param('memberId') memberId: string,
    @Body() updateDto: UpdateEnrollmentStatusDto,
  ) {
    return this.classesService.updateEnrollmentStatusByMember(
      batchId,
      memberId,
      updateDto,
    );
  }

  @Post('ets/batches/:id/leadership')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Assign leadership to ETS batch' })
  @ApiParam({ name: 'id' })
  @ApiCreatedResponse({ description: 'Leadership assigned successfully' })
  async assignETSLeadership(
    @Param('id') id: string,
    @Body() assignDto: AssignClassLeadershipDto,
  ) {
    return this.classesService.assignClassLeadership(id, assignDto);
  }
}
