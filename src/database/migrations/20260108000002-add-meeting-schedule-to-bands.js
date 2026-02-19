'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('bands', 'meeting_schedule_day', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('bands', 'meeting_schedule_time', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('bands', 'meeting_schedule_time');
    await queryInterface.removeColumn('bands', 'meeting_schedule_day');
  },
};

