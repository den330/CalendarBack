const logoutController = require("../Controllers/LogoutController");
const express = require("express");
const logoutRoute = express.Router();

logoutRoute.get("/", logoutController);

module.exports = logoutRoute;
