const UserModel = require("../Models/UserModel");
const asyncHandler = require("express-async-handler");

const logoutController = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const user = await UserModel.findById(userId);
  user.refreshToken = "";
  await user.save();
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  res.status(200).json({ message: "User logged out" });
});

module.exports = logoutController;
