const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const constants = require("./constants");
const contactsRouter = require("./router/contactsRouter");
const userRouter = require("./router/userRouter");
const database = require("./database");

const app = express();

async function main() {
  //
  await database.start();

  app.use(
    "/images",
    express.static(path.join(process.cwd(), "public", "images"))
  );

  app.use(express.json());

  app.use(cors());

  app.use(morgan("dev"));

  app.use("/api/contacts", contactsRouter);

  app.use("/api", userRouter);

  app.use((req, res) => {
    res.status(404).send("page not found...");
  });

  app.listen(constants.PORT, (e) =>
    e ? console.error(e) : console.log(`server started at ${constants.PORT}`)
  );
}
main();
