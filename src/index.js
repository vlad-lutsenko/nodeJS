const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const constants = require("./constants");
const router = require("./router/contactsRouter");
const database = require("./database");

const app = express();

async function main() {
  //
  await database.start();

  app.use(express.json());

  app.use(cors());

  app.use(morgan("dev"));

  app.use("/api/contacts", router);

  app.use((req, res) => {
    res.status(404).send("page not found");
  });

  app.listen(constants.PORT, (e) =>
    e ? console.error(e) : console.log(`server started at ${constants.PORT}`)
  );
}
main();
