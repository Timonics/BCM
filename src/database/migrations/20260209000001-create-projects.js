'use strict';

/**
 * Migration: Create projects table for committee/project management
 * Committee roles are stored in leadership_assignments (scopeEntity PROJECT, scopeId = project id)
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('projects', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      project_type: {
        type: Sequelize.ENUM(
          'Evangelism',
          'Worship',
          'Education',
          'Infrastructure',
          'Welfare',
          'Youth',
          'Program',
          'Event',
          'Construction',
          'Outreach',
          'General',
        ),
        allowNull: false,
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('active', 'planned', 'completed', 'archived'),
        allowNull: false,
        defaultValue: 'active',
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('projects');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_projects_project_type";',
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_projects_status";',
    );
  },
};
