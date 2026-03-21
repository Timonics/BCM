'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('report_history', 'dateRange', 'date_range');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('report_history', 'date_range', 'dateRange');
  },
};
