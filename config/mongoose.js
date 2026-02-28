//Require the Mongoose Library
const mongoose = require("mongoose");
//Require the Environment File for getting the Environment Variables
const env = require("./environment");

//Connect to MongoDB
const db = mongoose.connect(env.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Export the Connection
module.exports = db;
