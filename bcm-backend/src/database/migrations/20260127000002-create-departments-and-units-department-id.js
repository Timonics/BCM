'use strict';

/**
 * Migration: Create departments table and add department_id to units
 * Departments are top-level org units; units belong to a department.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('departments', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      category: {
        type: Sequelize.ENUM('Ministry', 'Administrative', 'Support', 'Outreach'),
        allowNull: false,
        defaultValue: 'Ministry',
      },
      head_of_department_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'members', key: 'id' },
        onDelete: 'SET NULL',
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      meeting_day: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      meeting_time: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('active', 'archived'),
        allowNull: false,
        defaultValue: 'active',
      },
      founded_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      max_units: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addColumn('units', 'department_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'departments', key: 'id' },
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('units', 'department_id');
    await queryInterface.dropTable('departments');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_departments_category";',
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_departments_status";',
    );
  },
};
