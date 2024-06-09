const asyncHandler = require("express-async-handler");
const UserModel = require("../Models/UserModel");

const addEmailController = asyncHandler(async (req, res) => {
  {
    const { email } = req.body;
    const userId = req.userId;
    await UserModel.addApprovedEmail(userId, email);
    res.status(201).json({ message: "Email added" });
  }
});

const removeEmailController = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const userId = req.userId;
  await UserModel.removeApprovedEmail(userId, email);
  res.status(200).json({ message: "Email removed" });
});

const getEmailsController = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const user = await UserModel.findById(userId);
  res.status(200).json({ emails: user.approvedEmailList });
});

module.exports = {
  addEmailController,
  removeEmailController,
  getEmailsController,
};
