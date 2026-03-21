import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { GenerateReportDto } from './dto/generate-report.dto';
import { ReportOverviewDto } from './dto/report-overview.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('reports')
@ApiBearerAuth('JWT-auth')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('overview')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({ summary: 'Get overview statistics for reports dashboard' })
  @ApiOkResponse({
    description: 'Overview data populated with real organizational counts',
    type: ReportOverviewDto,
  })
  async getOverview() {
    return this.reportsService.getOverview();
  }

  @Post('generate')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({ summary: 'Generate a new report based on inputs' })
  @ApiCreatedResponse({
    description: 'Report successfully generated and pushed to history',
  })
  async generateReport(@Body() dto: GenerateReportDto, @Request() req: any) {
    // Extract userId dynamically from protected role guard request validation
    const userId = req.user?.id;
    return this.reportsService.generateReport(dto, userId);
  }

  @Get('history')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({ summary: 'Get generated reports history list' })
  @ApiOkResponse({ description: 'Paginated list of historical reports' })
  async getHistory(@Query('page') page: string, @Query('limit') limit: string) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.reportsService.getReportHistory(pageNum, limitNum);
  }
}
