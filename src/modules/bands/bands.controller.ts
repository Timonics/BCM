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
import { BandsService } from './bands.service';
import { CreateBandDto } from './dto/create-band.dto';
import { UpdateBandDto } from './dto/update-band.dto';
import { AddBandMemberDto } from './dto/add-band-member.dto';
import { AssignBandExecutiveDto } from './dto/assign-band-executive.dto';
import { BandOverviewResponseDto } from './dto/band-overview-response.dto';
import { BandDetailResponseDto } from './dto/band-detail-response.dto';
import { BandLeadershipResponseDto } from './dto/band-leadership-response.dto';
import { BandMemberResponseDto } from './dto/band-member-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('bands')
@ApiBearerAuth('JWT-auth')
@Controller('bands')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class BandsController {
  constructor(private readonly bandsService: BandsService) {}

  @Post()
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Create a new band' })
  @ApiCreatedResponse({ description: 'Band created successfully' })
  async createBand(@Body() createBandDto: CreateBandDto) {
    return this.bandsService.createBand(createBandDto);
  }

  @Get()
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({
    summary: 'Get all bands with overview statistics',
    description:
      'Returns list of bands with overview (total members, active members, overgrown members, last updated) ',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by band name or code',
  })
  @ApiOkResponse({
    description: 'List of bands with overview statistics',
    type: [BandOverviewResponseDto],
  })
  async getAllBands(@Query('search') search?: string) {
    return this.bandsService.getAllBands(search);
  }

  @Get('overview')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({ summary: 'Get band overview statistics' })
  @ApiOkResponse({ description: 'Band overview statistics' })
  async getBandsOverview() {
    return this.bandsService.getBandsOverview();
  }

  @Get(':id')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({ summary: 'Get band details with coordinator information' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    description: 'Band details with coordinator',
    type: BandDetailResponseDto,
  })
  async getBandById(@Param('id') id: string) {
    return this.bandsService.getBandDetails(id);
  }

  @Get(':id/leadership')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({ summary: 'Get band leadership team' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    description: 'List of band leadership team members',
    type: [BandLeadershipResponseDto],
  })
  async getBandLeadershipTeam(@Param('id') id: string) {
    return this.bandsService.getBandLeadershipTeam(id);
  }

  @Get(':id/members')
  @Roles('admin', 'superadmin', 'coordinator')
  @ApiOperation({ summary: 'Get band members with detailed information' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    description: 'List of band members with details',
    type: [BandMemberResponseDto],
  })
  async getBandMembers(@Param('id') id: string) {
    return this.bandsService.getBandMembers(id);
  }

  @Patch(':id')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Update band' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ description: 'Band updated successfully' })
  async updateBand(
    @Param('id') id: string,
    @Body() updateBandDto: UpdateBandDto,
  ) {
    return this.bandsService.updateBand(id, updateBandDto);
  }

  @Delete(':id')
  @Roles('superadmin')
  @ApiOperation({ summary: 'Delete band (superadmin only)' })
  @ApiParam({ name: 'id' })
  async deleteBand(@Param('id') id: string) {
    return this.bandsService.deleteBand(id);
  }

  @Post(':id/members')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Add member to band' })
  @ApiParam({ name: 'id' })
  @ApiCreatedResponse({ description: 'Member added to band' })
  async addMemberToBand(
    @Param('id') id: string,
    @Body() addMemberDto: AddBandMemberDto,
  ) {
    return this.bandsService.addMemberToBand(id, addMemberDto);
  }

  @Delete(':id/members/:memberId')
  @Roles('admin', 'superadmin')
  @ApiOperation({
    summary: 'Remove member from band',
    description:
      'Removes a member from the band by deactivating their membership.',
  })
  @ApiParam({ name: 'id', description: 'Band ID' })
  @ApiParam({ name: 'memberId', description: 'Member ID' })
  @ApiOkResponse({ description: 'Member removed from band successfully' })
  async removeMemberFromBand(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
  ) {
    return this.bandsService.removeMemberFromBand(id, memberId);
  }

  @Post(':id/executives')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Assign band executive' })
  @ApiParam({ name: 'id' })
  @ApiCreatedResponse({ description: 'Executive assigned' })
  async assignBandExecutive(
    @Param('id') id: string,
    @Body() assignDto: AssignBandExecutiveDto,
  ) {
    return this.bandsService.assignBandExecutive(id, assignDto);
  }
}
