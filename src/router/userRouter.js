const express = require("express");
const path = require("path");
const uuid = require("uuid").v4;
const sgMail = require("@sendgrid/mail");

const UserModel = require("../models/UserModel");
const authorization = require("../middlewares/authorization");
const adminKeyForUserSubscriptionChange = require("../constants").ADMIN_KEY;
const minifyImage = require("../helpers/minifyImage");
const avatarCreator = require("../helpers/avatarCreator");
const {
  PORT,
  SENDGRID_API_KEY,
  SENDGRID_EMAIL_SENDER,
} = require("../constants");
const upload = require("../helpers/multerUpload");

const router = express.Router();

router.post("/auth/register", async (req, res) => {
  try {
    try {
      await UserModel.validateInput(req.body);
    } catch (error) {
      return res.status(400).send(error.message);
    }

    const { email, password } = req.body;

    const emailTest = await UserModel.findOne({ email });

    if (emailTest) {
      return res.status(409).json({ message: "Email in use" });
    }

    await avatarCreator(email);

    const pathToFile = path.join(process.cwd(), "temp", `${email}-avatar.png`);
    const destination = path.join(process.cwd(), "public", "images");

    await minifyImage(pathToFile, destination);

    const avatarURL = `http://localhost:${PORT}/images/${email}-avatar.png`;

    const verificationToken = uuid();

    const user = await UserModel.create({
      email,
      password,
      avatarURL,
      verificationToken,
    });

    sgMail.setApiKey(SENDGRID_API_KEY);

    const msg = {
      to: email,
      from: SENDGRID_EMAIL_SENDER,
      subject: "email verification for myApp",
      html: `<a href="http://localhost:${PORT}/api/auth/verify/${verificationToken}">email verification</a>`,
    };
    sgMail.send(msg);

    const { subscription } = user;

    res.status(201).json({ user: { email, subscription } });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    try {
      await UserModel.validateInput(req.body);
    } catch (error) {
      return res.status(400).send(error.message);
    }

    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }
    if (!(await user.isPasswordValid(password))) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const token = user.generateToken();

    user.token = token;

    await user.save();

    res.status(200).json({
      token: token,
      user: {
        email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/users/logout", authorization, async (req, res) => {
  await UserModel.findByIdAndUpdate(req.user.id, { token: null });
  res.status(204).send();
});

router.get("/users/current", authorization, (req, res) => {
  const user = req.user;
  const { email, subscription } = user;
  return res.status(200).json({ email, subscription });
});

router.patch(
  "/users/avatars",
  authorization,
  upload.single("image"),
  async (req, res) => {
    const { user, file } = req;

    const destination = path.join(process.cwd(), "public", "images");
    await minifyImage(file.path, destination);

    avatarURL = `http://localhost:${PORT}/images/${file.filename}`;

    await UserModel.findByIdAndUpdate(user._id, { avatarURL });

    res.status(200).json({ avatarURL });
  }
);

router.patch("/users", async (req, res) => {
  const { subscription, userEmail, adminKey } = req.body;

  if (adminKey !== adminKeyForUserSubscriptionChange) {
    return res.status(403).json({ message: "access denied" });
  }
  const subscriptions = ["free", "pro", "premium"];

  if (!subscriptions.includes(subscription)) {
    return res.status(400).json({
      message: `subscription must be one of ${subscriptions}`,
    });
  }

  await UserModel.findOneAndUpdate({ email: userEmail }, { subscription });

  res.status(200).json({ message: `user's ${userEmail} subscription updated` });
});

router.get("/auth/verify/:verificationToken", async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await UserModel.findOne({ verificationToken });

  if (!user) {
    return res.status(404).send("User not found");
  }

  await UserModel.findByIdAndUpdate(user._id, { verificationToken: null });

  res.status(200).send("email successfully verified");
});

module.exports = router;
