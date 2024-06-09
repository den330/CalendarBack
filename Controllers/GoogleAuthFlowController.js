const asyncHandler = require("express-async-handler");
const { loginFlow } = require("./LoginController");
const UserModel = require("../Models/UserModel");

const googleAuthFlowController = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }
  try {
    await UserModel.createUser(email, "", false);
    loginFlow(email, "", false, req, res);
  } catch (e) {
    if (e.code === 409) {
      loginFlow(email, "", false, req, res);
    } else {
      console.error(e);
      throw e;
    }
  }
});

module.exports = googleAuthFlowController;
