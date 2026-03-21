import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ScheduleModule } from '@nestjs/schedule';

// Core modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MembersModule } from './modules/members/members.module';
import { BandsModule } from './modules/bands/bands.module';
import { UnitsModule } from './modules/units/units.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { ClassesModule } from './modules/classes/classes.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { NotificationsModule } from './notifications/notifications.module';
import { LeadershipModule } from './modules/leadership/leadership.module';
import { CommitteesModule } from './modules/committees/committees.module';
import { AttendanceModule } from './modules/attendance/attendance.module';

// Guards
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

// Middleware
import { LoggingMiddleware } from './common/middleware/logging.middleware';

// Database configuration
import { databaseConfig } from './config/database.config';

/**
 * Root application module
 * Imports all feature modules and configures global settings
 * Sets up global JWT authentication guard (all routes protected by default)
 */
@Module({
  imports: [
    // Configuration module - loads environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database connection using Sequelize
    SequelizeModule.forRootAsync({
      useFactory: () => databaseConfig,
    }),

    // Task scheduling for background jobs (e.g., batch creation, notifications)
    ScheduleModule.forRoot(),

    // Feature modules
    AuthModule,
    UsersModule,
    MembersModule,
    BandsModule,
    UnitsModule,
    DepartmentsModule,
    ClassesModule,
    DashboardModule,
    NotificationsModule,
    LeadershipModule,
    CommitteesModule,
    AttendanceModule,
  ],
  providers: [
    // Global JWT authentication guard
    // All routes are protected by default unless marked with @Public()
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  /**
   * Configure middleware
   * Applies logging middleware to all routes
   */
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
