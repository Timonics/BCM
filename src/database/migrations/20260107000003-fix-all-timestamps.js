'use strict';

/**
 * Fix all missing timestamp columns
 * Adds updated_at to all tables that are missing it
 * Sequelize global config has timestamps: true, so all tables need these columns
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Helper function to check and add column
    const addColumnIfMissing = async (tableName, columnName) => {
      const [columns] = await queryInterface.sequelize.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = '${tableName}' AND column_name = '${columnName}'
      `);
      
      if (columns.length === 0) {
        await queryInterface.addColumn(tableName, columnName, {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        });
        console.log(`Added ${columnName} to ${tableName}`);
      }
    };

    // Fix band_memberships
    await addColumnIfMissing('band_memberships', 'updated_at');

    // Fix unit_memberships
    await addColumnIfMissing('unit_memberships', 'updated_at');

    // Fix class_enrollments (needs both)
    await addColumnIfMissing('class_enrollments', 'created_at');
    await addColumnIfMissing('class_enrollments', 'updated_at');

    // Fix class_batches
    await addColumnIfMissing('class_batches', 'updated_at');

    // Fix leadership_assignments
    await addColumnIfMissing('leadership_assignments', 'updated_at');

    // Fix leadership_role_templates
    await addColumnIfMissing('leadership_role_templates', 'updated_at');

    // Fix bands
    await addColumnIfMissing('bands', 'updated_at');

    // Fix units
    await addColumnIfMissing('units', 'updated_at');
  },

  async down(queryInterface, Sequelize) {
    // Remove columns if needed (rollback)
    const tables = [
      'band_memberships',
      'unit_memberships',
      'class_enrollments',
      'class_batches',
      'leadership_assignments',
      'leadership_role_templates',
      'bands',
      'units',
    ];

    for (const table of tables) {
      try {
        await queryInterface.removeColumn(table, 'updated_at');
      } catch (e) {
        // Ignore if column doesn't exist
      }
    }

    try {
      await queryInterface.removeColumn('class_enrollments', 'created_at');
    } catch (e) {
      // Ignore if column doesn't exist
    }
  },
};


