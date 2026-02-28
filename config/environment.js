//Require the Dotenv Library
require("dotenv").config();

//Production Environment
const production = {
  name: process.env.ENVIRONMENT,
  db: process.env.DB,
  db_name: process.env.DB_NAME,
  deployment: process.env.DEPLOYMENT,
};

module.exports = production;
