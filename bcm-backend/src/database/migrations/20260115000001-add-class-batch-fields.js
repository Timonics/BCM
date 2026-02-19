'use strict';

/**
 * Migration: Add new fields to class_batches and class_enrollments tables
 * - class_batches: description, max_capacity, updated_at
 * - class_enrollments: sessions_attended, total_sessions, graduation_status, band_eligible, created_at, updated_at
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add fields to class_batches
    await queryInterface.addColumn('class_batches', 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('class_batches', 'max_capacity', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // Add updated_at if it doesn't exist
    const classBatchesTable = await queryInterface.describeTable('class_batches');
    if (!classBatchesTable.updated_at) {
      await queryInterface.addColumn('class_batches', 'updated_at', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      });
    }

    // Add fields to class_enrollments
    await queryInterface.addColumn('class_enrollments', 'sessions_attended', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn('class_enrollments', 'total_sessions', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // Create graduation_status enum if it doesn't exist
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_class_enrollments_graduation_status" AS ENUM('ready', 'not_ready');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryInterface.addColumn('class_enrollments', 'graduation_status', {
      type: Sequelize.ENUM('ready', 'not_ready'),
      allowNull: false,
      defaultValue: 'not_ready',
    });

    await queryInterface.addColumn('class_enrollments', 'band_eligible', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    // Add created_at and updated_at if they don't exist
    const classEnrollmentsTable = await queryInterface.describeTable('class_enrollments');
    if (!classEnrollmentsTable.created_at) {
      await queryInterface.addColumn('class_enrollments', 'created_at', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      });
    }

    if (!classEnrollmentsTable.updated_at) {
      await queryInterface.addColumn('class_enrollments', 'updated_at', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      });
    }

    // Update class_batches status enum to include new statuses
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        ALTER TYPE "enum_class_batches_status" ADD VALUE IF NOT EXISTS 'not_started';
        ALTER TYPE "enum_class_batches_status" ADD VALUE IF NOT EXISTS 'started';
        ALTER TYPE "enum_class_batches_status" ADD VALUE IF NOT EXISTS 'completed';
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
  },

  async down(queryInterface, Sequelize) {
    // Remove fields from class_enrollments
    await queryInterface.removeColumn('class_enrollments', 'band_eligible');
    await queryInterface.removeColumn('class_enrollments', 'graduation_status');
    await queryInterface.removeColumn('class_enrollments', 'total_sessions');
    await queryInterface.removeColumn('class_enrollments', 'sessions_attended');

    // Remove fields from class_batches
    await queryInterface.removeColumn('class_batches', 'max_capacity');
    await queryInterface.removeColumn('class_batches', 'description');

    // Note: We don't remove updated_at, created_at as they might have been added in previous migrations
  },
};
