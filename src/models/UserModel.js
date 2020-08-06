const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const saltRounds = require("../constants").SALT_ROUNDS;
const tokenKey = require("../constants").TOKEN_SECRET_KEY;

const UserSchema = mongoose.Schema({
  email: String,
  password: String,
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },
  token: String,
  avatarURL: String,
});

UserSchema.pre("save", async function (next) {
  if (!this.isNew) next();

  this.password = await bcrypt.hash(this.password, saltRounds);

  return next();
});

UserSchema.method("isPasswordValid", async function (password) {
  return bcrypt.compare(password, this.password);
});

UserSchema.method("generateToken", function () {
  return jwt.sign({ id: this._id }, tokenKey, {
    expiresIn: "1h",
  });
});

UserSchema.static("validateInput", async function (data) {
  const validationSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().email().required(),
  });

  const { error } = await validationSchema.validate(data);
  if (error) {
    throw new Error(error.message);
  }
});

module.exports = mongoose.model("User", UserSchema);
