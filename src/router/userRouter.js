const express = require("express");

const UserModel = require("../models/UserModel");
const authorization = require("../middlewares/authorization");

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

    const user = await UserModel.create({
      email,
      password,
    });

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

module.exports = router;
