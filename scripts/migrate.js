// Migration runner script for Sequelize
// Usage: node scripts/migrate.js

const sequelize = require("../config/sequelize");
const path = require("path");
const fs = require("fs");

const migrationsPath = path.join(__dirname, "../migrations");

async function runMigrations() {
  try {
    console.log("Running migrations...");

    // Get all migration files
    const migrationFiles = fs.readdirSync(migrationsPath).sort();

    for (const file of migrationFiles) {
      if (file.endsWith(".js")) {
        const migration = require(path.join(migrationsPath, file));
        console.log(`Running migration: ${file}`);
        await migration.up(sequelize.getQueryInterface(), sequelize.Sequelize);
        console.log(`Migration ${file} completed successfully`);
      }
    }

    console.log("All migrations completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
}

runMigrations();
