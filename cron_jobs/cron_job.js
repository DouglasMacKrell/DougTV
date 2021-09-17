const broadcastQueries = require("../queries/broadcast");
const cron = require("node-cron");
const db = require("../db");

cron.schedule("0 23 * * *", () => {
  broadcastQueries.deleteAll();
});

module.exports = cron;