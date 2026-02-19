import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * DTO for CSV import
 * Accepts base64 encoded CSV file or file path
 */
export class CsvImportDto {
  @ApiProperty({
    description: 'Base64 encoded CSV file content',
    example: 'data:text/csv;base64,Zmlyc3RfbmFtZSxzdXJuYW1lLGdlbmRlcg==',
  })
  @IsString()
  @IsNotEmpty()
  fileBase64: string;

  @ApiPropertyOptional({
    description: 'CSV filename',
    example: 'members.csv',
  })
  @IsOptional()
  @IsString()
  filename?: string;
}
