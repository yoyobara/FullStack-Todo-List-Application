// Require Sequelize
const { Sequelize } = require("sequelize");

// Require the Environment File for getting the Environment Variables
const env = require("./environment");

// Create Sequelize instance with PostgreSQL connection
const sequelize = new Sequelize(
  env.db_name || process.env.DB_NAME || "todo_list",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "postgres",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false, // set to console.log for debugging
  },
);

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log("PostgreSQL connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Export the Sequelize instance
module.exports = sequelize;
