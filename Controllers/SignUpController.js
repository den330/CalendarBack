const asyncHandler = require("express-async-handler");
const UserModel = require("../Models/UserModel");

const signUpController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  await UserModel.createUser(email, password);
  res.status(201).json({ message: "User created" });
});

module.exports = signUpController;
