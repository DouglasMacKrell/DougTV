const pgp = require('pg-promise')();
//temp connection string before switching to .env
const connectionString =
  process.env.DATABASE_URL || "postgres://localhost:5432/dougtv";
const db = pgp(connectionString);

module.exports = db