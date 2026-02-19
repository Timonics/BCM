'use strict';

/**
 * Migration: Add 'DEPARTMENT' to leadership_role_templates category enum
 * Enables department-level role templates (Head of Department, Assistant Head, etc.)
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_leadership_role_templates_category" ADD VALUE IF NOT EXISTS 'DEPARTMENT';`,
    );
  },

  async down() {
    // PostgreSQL does not support removing enum values
  },
};
