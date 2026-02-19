'use strict';

/**
 * Migration: Add 'DEPARTMENT' to leadership_assignments scope_entity enum
 * Enables department-level leadership (Head of Department, Assistant Head, etc.)
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_leadership_assignments_scope_entity" ADD VALUE IF NOT EXISTS 'DEPARTMENT';`,
    );
  },

  async down() {
    // PostgreSQL does not support removing enum values; leave as-is for data integrity
  },
};
