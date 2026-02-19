'use strict';

/**
 * Fix missing updated_at columns
 * Adds updated_at to tables that were created without it
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add updated_at to roles table if it doesn't exist
    const [rolesColumns] = await queryInterface.sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'roles' AND column_name = 'updated_at'
    `);
    
    if (rolesColumns.length === 0) {
      await queryInterface.addColumn('roles', 'updated_at', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      });
    }

    // Add created_at and updated_at to permissions table if they don't exist
    const [permissionsColumns] = await queryInterface.sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'permissions' AND column_name IN ('created_at', 'updated_at')
    `);
    
    const permissionsHasCreatedAt = permissionsColumns.some(col => col.column_name === 'created_at');
    const permissionsHasUpdatedAt = permissionsColumns.some(col => col.column_name === 'updated_at');

    if (!permissionsHasCreatedAt) {
      await queryInterface.addColumn('permissions', 'created_at', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      });
    }

    if (!permissionsHasUpdatedAt) {
      await queryInterface.addColumn('permissions', 'updated_at', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      });
    }

    // Add created_at and updated_at to class_types if they don't exist
    const [classTypesColumns] = await queryInterface.sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'class_types' AND column_name IN ('created_at', 'updated_at')
    `);
    
    const hasCreatedAt = classTypesColumns.some(col => col.column_name === 'created_at');
    const hasUpdatedAt = classTypesColumns.some(col => col.column_name === 'updated_at');

    if (!hasCreatedAt) {
      await queryInterface.addColumn('class_types', 'created_at', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      });
    }

    if (!hasUpdatedAt) {
      await queryInterface.addColumn('class_types', 'updated_at', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('roles', 'updated_at');
    await queryInterface.removeColumn('permissions', 'created_at');
    await queryInterface.removeColumn('permissions', 'updated_at');
    await queryInterface.removeColumn('class_types', 'created_at');
    await queryInterface.removeColumn('class_types', 'updated_at');
  },
};

