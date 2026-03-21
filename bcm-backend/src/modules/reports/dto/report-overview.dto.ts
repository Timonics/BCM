import { ApiProperty } from '@nestjs/swagger';

export class ReportOverviewDto {
  @ApiProperty({ description: 'Total members'})
  totalMembers: number;

  @ApiProperty({ description: 'Active leaders'})
  activeLeaders: number;

  @ApiProperty({ description: 'Active bands and units'})
  activeBandsAndUnits: number;

  @ApiProperty({
    description: 'Total attendance records this year'
  })
  attendanceRecords: number;

  @ApiProperty({
    description: 'When the last report was generated',
    example: 'Today, 09:45 AM',
  })
  lastReportGenerated: string | null;

  @ApiProperty({ description: 'Reports generated this month' })
  reportsThisMonth: number;

  @ApiProperty({
    description: 'Most often generated report type'
  })
  mostGenerated: string | null;

  @ApiProperty({ description: 'Total exports this year'})
  totalExports: number;
}
