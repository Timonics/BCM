import { PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';

/**
 * DTO for updating a committee project
 */
export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
