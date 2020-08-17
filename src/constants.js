require("dotenv").config();

module.exports = {
  PORT: "1010",
  CONNECTION_URL: process.env.CONNECTION_URL,
  SALT_ROUNDS: Number(process.env.SALT_ROUNDS),
  TOKEN_SECRET_KEY: process.env.TOKEN_SECRET_KEY,
  ADMIN_KEY: process.env.ADMIN_KEY,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SENDGRID_EMAIL_SENDER: process.env.SENDGRID_EMAIL_SENDER,
};
