'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create member_academics table
    await queryInterface.createTable('member_academics', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      member_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'members',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      institution: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      course_program: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      qualification: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      end_date: {
        type: Sequelize.DATEONLY,
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

    // Create member_employment table
    await queryInterface.createTable('member_employment', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      member_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'members',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      place_of_work: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      office_address: {
        type: Sequelize.TEXT,
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

    // Add indexes for better query performance
    await queryInterface.addIndex('member_academics', ['member_id']);
    await queryInterface.addIndex('member_employment', ['member_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('member_employment');
    await queryInterface.dropTable('member_academics');
  },
};

