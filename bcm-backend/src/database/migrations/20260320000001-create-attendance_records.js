'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attendance_records', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      session_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'attendance_sessions', key: 'id' },
        onDelete: 'CASCADE',
        unique: 'unique_attendance_per_session',
      },
      member_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'members', key: 'id' },
        onDelete: 'CASCADE',
        unique: 'unique_attendance_per_session',
      },
      attendance_status: {
        type: Sequelize.ENUM('Present', 'Absent', 'Late', 'Excused'),
        allowNull: false,
      },
      check_in_time: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      notes: {
        type: Sequelize.TEXT,
      },
      marked_by: {
        type: Sequelize.UUID,
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
    await queryInterface.dropTable('attendance_records');
  },
};
