'use strict';

/**
 * Migration: Add 'inactive' status to leadership_status enum
 * Allows leaders to be marked as inactive (e.g., on suspension)
 * without ending their assignment
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    // PostgreSQL: Add 'inactive' value to existing enum type
    // Note: ALTER TYPE ... ADD VALUE cannot be run inside a transaction in older PostgreSQL versions
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_leadership_assignments_leadership_status" ADD VALUE IF NOT EXISTS 'inactive';`,
    );
  },

  async down(queryInterface, Sequelize) {
    // Note: PostgreSQL doesn't support removing enum values directly
    // We would need to:
    // 1. Create a new enum without 'inactive'
    // 2. Update all rows with 'inactive' to 'ended'
    // 3. Alter column to use new enum
    // 4. Drop old enum
    // For safety, we'll just update existing 'inactive' records to 'ended'
    await queryInterface.sequelize.query(
      `UPDATE leadership_assignments SET leadership_status = 'ended', end_reason = 'suspended' WHERE leadership_status = 'inactive';`,
    );
    
    // Then we'd need to recreate the enum without 'inactive'
    // This is complex and may not be fully reversible, so we'll leave a comment
    // In production, consider keeping the enum value for historical data integrity
  },
};
