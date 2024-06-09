const { loginController } = require("../Controllers/LoginController");
const express = require("express");
const loginRoute = express.Router();

loginRoute.post("/", loginController);

module.exports = loginRoute;
