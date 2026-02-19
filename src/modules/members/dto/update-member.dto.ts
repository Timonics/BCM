import { PartialType } from '@nestjs/swagger';
import { CreateMemberDto } from './create-member.dto';

/**
 * DTO for updating a member
 * All fields are optional
 */
export class UpdateMemberDto extends PartialType(CreateMemberDto) {}

