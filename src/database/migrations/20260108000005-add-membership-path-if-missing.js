'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if the column exists
    const [columns] = await queryInterface.sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'members' AND column_name = 'membership_path';
    `);

    if (columns && columns.length > 0) {
      console.log('Column membership_path already exists. Skipping.');
      return;
    }

    // Check if members table exists
    const [tables] = await queryInterface.sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'members' AND table_schema = 'public';
    `);

    if (!tables || tables.length === 0) {
      console.log('Members table does not exist. Please run initial migration first.');
      return;
    }

    // Create the enum type if it doesn't exist
    const [enumTypes] = await queryInterface.sequelize.query(`
      SELECT typname 
      FROM pg_type 
      WHERE typname = 'enum_members_membership_path';
    `);

    if (!enumTypes || enumTypes.length === 0) {
      await queryInterface.sequelize.query(`
        CREATE TYPE enum_members_membership_path AS ENUM ('transfer', 'birth', 'new_convert', 'marriage');
      `);
    }

    // Add the column using raw SQL to ensure enum type is used correctly
    await queryInterface.sequelize.query(`
      ALTER TABLE members 
      ADD COLUMN IF NOT EXISTS membership_path enum_members_membership_path;
    `);

    console.log('Added membership_path column to members table.');
  },

  async down(queryInterface, Sequelize) {
    // Check if column exists before removing
    const [columns] = await queryInterface.sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'members' AND column_name = 'membership_path';
    `);

    if (columns && columns.length > 0) {
      await queryInterface.removeColumn('members', 'membership_path');
    }
  },
};

