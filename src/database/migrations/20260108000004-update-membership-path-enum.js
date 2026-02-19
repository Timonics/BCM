'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // PostgreSQL doesn't support direct enum modification, so we need to:
    // 1. Check if the column exists
    // 2. Find the actual enum type name (it's usually enum_table_column)
    // 3. Create a new enum type
    // 4. Alter the column to use the new enum
    // 5. Drop the old enum type and rename the new one

    // First, check if the column exists
    const [columns] = await queryInterface.sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'members' AND column_name = 'membership_path';
    `);

    if (!columns || columns.length === 0) {
      console.log('Column membership_path does not exist. Skipping enum update.');
      return;
    }

    // Find the actual enum type name
    const [enumTypes] = await queryInterface.sequelize.query(`
      SELECT DISTINCT t.typname 
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid 
      WHERE e.enumlabel IN ('born_in_church', 'adult_intake')
      LIMIT 1;
    `);

    const oldEnumTypeName = enumTypes && enumTypes[0] ? enumTypes[0].typname : 'enum_members_membership_path';

    // Drop the new enum type if it exists from a previous failed migration
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS membership_path_new CASCADE;
    `);

    // Create new enum type
    await queryInterface.sequelize.query(`
      CREATE TYPE membership_path_new AS ENUM ('transfer', 'birth', 'new_convert', 'marriage');
    `);

    // Update the column to use new enum
    await queryInterface.sequelize.query(`
      ALTER TABLE "members" 
      ALTER COLUMN "membership_path" TYPE membership_path_new 
      USING CASE 
        WHEN "membership_path"::text = 'born_in_church' THEN 'birth'::membership_path_new
        WHEN "membership_path"::text = 'adult_intake' THEN 'new_convert'::membership_path_new
        ELSE NULL
      END;
    `);

    // Now drop the old enum type (after column is updated)
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS ${oldEnumTypeName} CASCADE;
    `);

    // Rename the new enum to match the old name (for Sequelize compatibility)
    await queryInterface.sequelize.query(`
      ALTER TYPE membership_path_new RENAME TO ${oldEnumTypeName};
    `);
  },

  async down(queryInterface, Sequelize) {
    // Find the current enum type name
    const [enumTypes] = await queryInterface.sequelize.query(`
      SELECT DISTINCT t.typname 
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid 
      WHERE e.enumlabel IN ('birth', 'new_convert', 'transfer', 'marriage')
      LIMIT 1;
    `);

    const currentEnumTypeName = enumTypes && enumTypes[0] ? enumTypes[0].typname : 'enum_members_membership_path';

    // Revert back to old enum values
    await queryInterface.sequelize.query(`
      CREATE TYPE membership_path_old AS ENUM ('born_in_church', 'adult_intake');
    `);

    // Check if column exists before reverting
    const [columns] = await queryInterface.sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'members' AND column_name = 'membership_path';
    `);

    if (!columns || columns.length === 0) {
      console.log('Column membership_path does not exist. Skipping enum revert.');
      return;
    }

    await queryInterface.sequelize.query(`
      ALTER TABLE "members" 
      ALTER COLUMN "membership_path" TYPE membership_path_old 
      USING CASE 
        WHEN "membership_path"::text = 'birth' THEN 'born_in_church'::membership_path_old
        WHEN "membership_path"::text = 'new_convert' THEN 'adult_intake'::membership_path_old
        WHEN "membership_path"::text = 'transfer' THEN 'adult_intake'::membership_path_old
        WHEN "membership_path"::text = 'marriage' THEN 'adult_intake'::membership_path_old
        ELSE NULL
      END;
    `);

    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS ${currentEnumTypeName} CASCADE;
    `);

    await queryInterface.sequelize.query(`
      ALTER TYPE membership_path_old RENAME TO ${currentEnumTypeName};
    `);
  },
};

