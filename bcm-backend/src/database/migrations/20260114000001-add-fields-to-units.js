'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('units', 'founded_date', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('units', 'meeting_schedule_day', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('units', 'meeting_schedule_time', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('units', 'meeting_schedule_time');
    await queryInterface.removeColumn('units', 'meeting_schedule_day');
    await queryInterface.removeColumn('units', 'founded_date');
  },
};
