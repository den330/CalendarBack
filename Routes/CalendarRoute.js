const calendarController = require("../Controllers/CalendarController");
const express = require("express");
const calendarRoute = express.Router();

calendarRoute.get("/getAllCalendar", calendarController.getAllCalendar);

module.exports = calendarRoute;
