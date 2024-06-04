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

module.exports = { addEmailController };
