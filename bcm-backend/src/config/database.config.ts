import { SequelizeModuleOptions } from '@nestjs/sequelize';
import * as models from '../database/models';

/**
 * Database configuration for Sequelize
 * Uses PostgreSQL as specified in requirements
 * Professional practice: Use migrations, not synchronize
 */
export const databaseConfig: SequelizeModuleOptions = {
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'bcm_db',
  models: Object.values(models), // Explicitly register all models
  autoLoadModels: false, // Disable auto-load, use explicit models
  synchronize: false, // NEVER use synchronize in production - use migrations
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true, // Converts camelCase to snake_case in database
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};
