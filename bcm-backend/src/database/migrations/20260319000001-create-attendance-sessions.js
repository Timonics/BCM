'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attendance_sessions', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      attendance_mode: {
        type: Sequelize.ENUM('Physical', 'Virtual', 'Hybrid'),
      },
      session_type: {
        type: Sequelize.ENUM(
          'General Service',
          'Band Meeting',
          'Unit Meeting',
          'Class Session',
          'Committee Meeting',
          'Special Program',
        ),
        allowNull: false,
      },
      session_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      marking_mode: {
        type: Sequelize.ENUM('Manual', 'Quick Count', 'Hybrid'),
        allowNull: false,
        defaultValue: 'Hybrid',
      },
      status: {
        type: Sequelize.ENUM('Open', 'Marked', 'Closed'),
        allowNull: false,
      },
      entity_id: {
        type: Sequelize.UUID,
      },
      entity_type: {
        type: Sequelize.STRING,
      },
      total_expected: {
        type: Sequelize.INTEGER,
      },
      total_marked: {
        type: Sequelize.INTEGER,
      },
      quick_count_total: {
        type: Sequelize.INTEGER,
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'RESTRICT',
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
    await queryInterface.dropTable('attendance_sessions');
  },
};
