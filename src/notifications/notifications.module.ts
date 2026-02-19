import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Notification } from '../database/models/notification.model';
import { User } from '../database/models/user.model';
import { Member } from '../database/models/member.model';

/**
 * Notifications Module
 * TODO: Implement notification system
 * - In-app notifications
 * - Email notifications
 * - Alert generation (over-age, expired leadership, pending completions)
 */
@Module({
  imports: [SequelizeModule.forFeature([Notification, User, Member])],
  controllers: [],
  providers: [],
  exports: [],
})
export class NotificationsModule {}
