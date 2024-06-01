const calendarController = require("../Controllers/CalendarController");
const express = require("express");
const calendarRoute = express.Router();

calendarRoute.get("/getOwnCalendar", calendarController.getOwnCalendar);

module.exports = calendarRoute;
