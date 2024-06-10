const asyncHandler = require("express-async-handler");
const UserModel = require("../Models/UserModel");

const signUpController = asyncHandler(async (req, res) => {
  const { email, password, requirePassword } = req.body;
  if (!email || (!password && requirePassword)) {
    res.status(400);
    throw new Error("Email and password are required");
  }
  console.log(
    `it reaches signUpController with email: ${email} and password: ${password}`
  );
  await UserModel.createUser(email, password, requirePassword);
  res.status(201).json({ message: "User created" });
});

module.exports = signUpController;
