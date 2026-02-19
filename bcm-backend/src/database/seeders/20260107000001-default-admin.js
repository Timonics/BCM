'use strict';

const bcrypt = require('bcrypt');

/**
 * Seed default admin user
 * Creates superadmin user with email: admin@bcm.org, password: password123
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Hash password for admin@bcm.org
    const passwordHash = await bcrypt.hash('password123', 10);

    // Create superadmin role
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'superadmin' LIMIT 1`
    );

    let roleId;
    if (roles.length === 0) {
      // Create superadmin role and get its ID
      await queryInterface.sequelize.query(`
        INSERT INTO roles (id, name, description, created_at)
        VALUES (gen_random_uuid(), 'superadmin', 'Super Administrator with full system access including delete permissions', CURRENT_TIMESTAMP)
      `);
      const [newRoles] = await queryInterface.sequelize.query(
        `SELECT id FROM roles WHERE name = 'superadmin' LIMIT 1`
      );
      roleId = newRoles[0].id;
    } else {
      roleId = roles[0].id;
    }

    // Create admin role if it doesn't exist
    const [adminRoles] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'admin' LIMIT 1`
    );
    if (adminRoles.length === 0) {
      await queryInterface.sequelize.query(`
        INSERT INTO roles (id, name, description, created_at)
        VALUES (gen_random_uuid(), 'admin', 'Administrator with full access except delete operations', CURRENT_TIMESTAMP)
      `);
    }

    // Check if admin user already exists
    const [existingUsers] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'admin@bcm.org' LIMIT 1`
    );

    if (existingUsers.length === 0) {
      // Create admin user using parameterized query
      await queryInterface.sequelize.query(
        `INSERT INTO users (id, email, password_hash, full_name, status, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        {
          bind: ['admin@bcm.org', passwordHash, 'System Administrator', 'active'],
        }
      );

      const [newUsers] = await queryInterface.sequelize.query(
        `SELECT id FROM users WHERE email = 'admin@bcm.org' LIMIT 1`
      );
      const userId = newUsers[0].id;

      // Assign superadmin role to user
      await queryInterface.sequelize.query(
        `INSERT INTO user_roles (user_id, role_id, assigned_at)
         VALUES ($1, $2, CURRENT_TIMESTAMP)`,
        {
          bind: [userId, roleId],
        }
      );
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove admin user
    await queryInterface.sequelize.query(
      `DELETE FROM users WHERE email = 'admin@bcm.org'`
    );
    // Remove roles (optional - comment out if you want to keep roles)
    // await queryInterface.sequelize.query(`DELETE FROM roles WHERE name IN ('superadmin', 'admin')`);
  },
};
