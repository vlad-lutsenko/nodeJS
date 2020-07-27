const mongoose = require("mongoose");
const constants = require("./constants");

const connectUrl = constants.CONNECTION_URL;
const dbName = "db-contacts";

const urlForMongoose = `${connectUrl}/${dbName}`;

class Database {
  constructor() {
    this.connection = null;
  }

  errorHandler(e) {
    console.error("database connection error");
    console.error(e);
    process.exit(1);
  }

  async start() {
    try {
      this.connection = await mongoose.connect(urlForMongoose, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      });
      console.info("Database connection successful");
    } catch (error) {
      this.errorHandler(error);
    }
  }
}

module.exports = new Database();
