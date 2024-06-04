const userController = require("../Controllers/UserController");
const express = require("express");
const userRoute = express.Router();

userRoute.post("/addEmail", userController.addEmailController);

module.exports = userRoute;
