import { PartialType } from '@nestjs/swagger';
import { CreateDepartmentDto } from './create-department.dto';

/**
 * DTO for updating a department
 */
export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {}
