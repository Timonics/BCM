'use strict';

/**
 * Add deleted_at column to members table for soft delete
 * Allows members to be marked as deleted without removing data
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if deleted_at column already exists
    const [columns] = await queryInterface.sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'members' AND column_name = 'deleted_at'
    `);

    // Add deleted_at column only if it doesn't exist
    if (columns.length === 0) {
      await queryInterface.addColumn('members', 'deleted_at', {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      });
      console.log('Added deleted_at column to members table');
    } else {
      console.log('deleted_at column already exists, skipping');
    }

    // Check if index already exists
    const [indexes] = await queryInterface.sequelize.query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename = 'members' AND indexname = 'idx_members_deleted_at'
    `);

    // Add index only if it doesn't exist
    if (indexes.length === 0) {
      await queryInterface.addIndex('members', ['deleted_at'], {
        name: 'idx_members_deleted_at',
      });
      console.log('Added index idx_members_deleted_at');
    } else {
      console.log('Index idx_members_deleted_at already exists, skipping');
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove index if it exists
    try {
      await queryInterface.removeIndex('members', 'idx_members_deleted_at');
    } catch (e) {
      // Index might not exist, ignore error
    }

    // Remove column if it exists
    try {
      await queryInterface.removeColumn('members', 'deleted_at');
    } catch (e) {
      // Column might not exist, ignore error
    }
  },
};

