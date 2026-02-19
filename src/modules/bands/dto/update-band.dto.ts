import { PartialType } from '@nestjs/swagger';
import { CreateBandDto } from './create-band.dto';

/**
 * DTO for updating a band
 */
export class UpdateBandDto extends PartialType(CreateBandDto) {}

