'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('attendance_sessions', 'male_count', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('attendance_sessions', 'female_count', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('attendance_sessions', 'male_count');
    await queryInterface.removeColumn('attendance_sessions', 'female_count');
  },
};
