const jwt = require("jsonwebtoken");

const tokenKey = require("../constants").TOKEN_SECRET_KEY;
const UserModel = require("../models/UserModel");

async function authorization(req, res, next) {
  try {
    const authorizationHeader = req.get("Authorization") || "";
    const token = authorizationHeader.replace("Bearer ", "");

    let userId;

    try {
      userId = await jwt.verify(token, tokenKey).id;
    } catch (error) {
      return res.status(401).send({ message: "Not authorized" });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(401).send({ message: "Not authorized" });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authorization;
