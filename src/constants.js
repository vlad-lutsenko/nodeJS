const { env } = require("yargs");

require("dotenv").config();

module.exports = {
  PORT: "1010",
  CONNECTION_URL: process.env.CONNECTION_URL,
};
