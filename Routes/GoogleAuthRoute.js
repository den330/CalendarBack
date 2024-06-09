const googleAuthFlowController = require("../Controllers/GoogleAuthFlowController");
const express = require("express");
const googleAuthRoute = express.Router();

googleAuthRoute.post("/", googleAuthFlowController);

module.exports = googleAuthRoute;
