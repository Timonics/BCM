import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AttendanceService } from './attendance.service';
import { AttendanceReportQueryDto } from './dto/attendance-report-query.dto';
import { CreateAttendanceSessionDto } from './dto/create-attendance-session.dto';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { QueryAttendanceSessionsDto } from './dto/query-attendance-sessions.dto';
import { SubmitQuickCountDto } from './dto/submit-quick-count.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('attendance')
@ApiBearerAuth('JWT-auth')
@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('sessions')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({ summary: 'Get attendance sessions' })
  @ApiOkResponse({ description: 'Attendance sessions returned successfully' })
  async getAttendanceSessions(@Query() query: QueryAttendanceSessionsDto) {
    const sessions = await this.attendanceService.getAttendanceSessions(query);

    return {
      success: true,
      data: sessions,
    };
  }

  @Get('reports')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({ summary: 'Get attendance analytics and reports' })
  @ApiOkResponse({ description: 'Attendance analytics returned successfully' })
  async getAttendanceReports(@Query() query: AttendanceReportQueryDto) {
    return this.attendanceService.getAttendanceReports(query);
  }

  @Get('sessions/:id')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({ summary: 'Get attendance session detail' })
  @ApiParam({ name: 'id', description: 'Attendance session ID' })
  @ApiOkResponse({
    description: 'Attendance session detail returned successfully',
  })
  async getAttendanceSessionById(@Param('id') id: string) {
    const session = await this.attendanceService.getAttendanceSessionById(id);

    return {
      success: true,
      data: session,
    };
  }

  @Post('sessions/:id/mark')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({ summary: 'Mark attendance for a session' })
  @ApiParam({ name: 'id', description: 'Attendance session ID' })
  @ApiOkResponse({ description: 'Attendance marked successfully' })
  async markAttendance(
    @Param('id') id: string,
    @Body() dto: MarkAttendanceDto,
    @Req() req: Request,
  ) {
    return this.attendanceService.markAttendance(id, dto, req.user as any);
  }

  @Post('sessions/:id/quick-count')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({ summary: 'Submit quick count for a session' })
  @ApiParam({ name: 'id', description: 'Attendance session ID' })
  @ApiOkResponse({ description: 'Quick count submitted successfully' })
  async submitQuickCount(
    @Param('id') id: string,
    @Body() dto: SubmitQuickCountDto,
  ) {
    return this.attendanceService.submitQuickCount(id, dto);
  }

  @Put('sessions/:id/close')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({ summary: 'Close attendance session' })
  @ApiParam({ name: 'id', description: 'Attendance session ID' })
  @ApiOkResponse({ description: 'Session closed successfully' })
  async closeAttendanceSession(@Param('id') id: string) {
    return this.attendanceService.closeAttendanceSession(id);
  }

  @Post('sessions')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Create an attendance session' })
  @ApiCreatedResponse({ description: 'Session created successfully' })
  async createAttendanceSession(
    @Body() createAttendanceSessionDto: CreateAttendanceSessionDto,
    @Req() req: Request,
  ) {
    const session = await this.attendanceService.createAttendanceSession(
      createAttendanceSessionDto,
      req.user as any,
    );

    return {
      success: true,
      message: 'Session created successfully',
      data: {
        id: session.id,
        title: session.title,
      },
    };
  }
}
