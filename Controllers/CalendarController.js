const UserModel = require("../Models/UserModel");
const CalendarModel = require("../Models/CalendarModel");
const asyncHandler = require("express-async-handler");

const getAllCalendar = asyncHandler(async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    res.status(401);
    throw new Error("User not found");
  }
  const user = await UserModel.getUserById(userId);
  const ownCalendar = await user.getOwnCalendar();
  const accessibleCalendars = await user.getAllAccessibleCalendars();
  res.status(200).json({
    ownCalendar: ownCalendar,
    accessibleCalendars: accessibleCalendars,
  });
});

const getEvents = asyncHandler(async (req, res) => {
  const calendarId = req.params.calendarId;
  const calendar = await CalendarModel.getCalendarById(calendarId);
  const events = await calendar.getEvents();
  res.status(200).json(events);
});

module.exports = {
  getAllCalendar,
  getEvents,
};
