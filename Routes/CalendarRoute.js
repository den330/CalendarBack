const calendarController = require("../Controllers/CalendarController");
const express = require("express");
const calendarRoute = express.Router();

calendarRoute.get("/getAllCalendar", calendarController.getAllCalendar);
calendarRoute.get("/getEvents/:calendarId", calendarController.getEvents);
calendarRoute.post("/addEvent", calendarController.addEvent);
calendarRoute.post("/removeEvent", calendarController.removeEvent);
calendarRoute.post("/updateEvent", calendarController.updateEvent);

module.exports = calendarRoute;
