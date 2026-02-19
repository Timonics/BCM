import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import { User } from '../../database/models/user.model';
import { Role } from '../../database/models/role.model';
import { UserRole } from '../../database/models/user-role.model';

/**
 * Users Module
 * Provides user management functionality
 */
@Module({
  imports: [SequelizeModule.forFeature([User, Role, UserRole])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
