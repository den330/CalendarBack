const userController = require("../Controllers/UserController");
const express = require("express");
const userRoute = express.Router();

userRoute.get("/getCurrentUser", userController.getCurrentUserController);

module.exports = userRoute;
