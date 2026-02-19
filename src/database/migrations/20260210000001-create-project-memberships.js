'use strict';

/**
 * Migration: Create project_memberships table for plain committee membership.
 * Leadership roles for committees remain in leadership_assignments (scopeEntity PROJECT).
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('project_memberships', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      project_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'projects', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      member_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'members', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_DATE'),
      },
      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      exit_reason: {
        type: Sequelize.STRING,
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

    await queryInterface.addIndex('project_memberships', ['project_id']);
    await queryInterface.addIndex('project_memberships', ['member_id']);
    await queryInterface.addIndex('project_memberships', ['project_id', 'member_id'], {
      unique: false,
      name: 'project_memberships_project_id_member_id_idx',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('project_memberships');
  },
};
