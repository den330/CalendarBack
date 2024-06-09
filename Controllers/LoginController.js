const UserModel = require("../Models/UserModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const loginController = asyncHandler(async (req, res) => {
  const { email, password, requirePassword } = req.body;
  if (!email || (!password && requirePassword)) {
    res.status(400);
    throw new Error("Email and password are required");
  }
  const user = await UserModel.login(email, password, requirePassword);
  const accessToken = jwt.sign(
    { id: user._id.toString() },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { id: user._id.toString() },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "30d" }
  );
  user.refreshToken = refreshToken;
  await user.save();
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  res
    .status(200)
    .json({ message: "User logged in", email: email, userId: user._id });
});

module.exports = loginController;
