const userController = require("../Controllers/UserController");
const express = require("express");
const userRoute = express.Router();

userRoute.post("/addEmail", userController.addEmailController);
userRoute.post("/removeEmail", userController.removeEmailController);
userRoute.get("/getEmails", userController.getEmailsController);

module.exports = userRoute;
