const express = require("express");
const signupRoute = express.Router();
const signupController = require("../Controllers/SignUpController");
signupRoute.post("/", signupController);

module.exports = signupRoute;
