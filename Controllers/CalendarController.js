const UserModel = require("../Models/UserModel");
const CalendarModel = require("../Models/CalendarModel");
const asyncHandler = require("express-async-handler");

const getAllCalendar = asyncHandler(async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    res.status(401);
    throw new Error("User not found");
  }
  const ownCalendar = await UserModel.getOwnCalendar(userId);
  const accessibleCalendars = await UserModel.getAllAccessibleCalendars(userId);
  res.status(200).json({
    ownCalendar: ownCalendar,
    accessibleCalendars: accessibleCalendars,
  });
});

const getEvents = asyncHandler(async (req, res) => {
  const calendarId = req.params.calendarId;
  const events = await CalendarModel.getEvents(calendarId);
  res.status(200).json(events);
});

const addEvent = asyncHandler(async (req, res) => {
  const { calendar_id, title, start, description, _id } = req.body;
  const creatorId = req.userId;
  await CalendarModel.addEvent(
    _id,
    calendar_id,
    title,
    creatorId,
    start,
    description
  );
  res.status(201).json({ message: "Event added" });
});

const removeEvent = asyncHandler(async (req, res) => {
  const { eventId, calendarId } = req.body;
  await CalendarModel.removeEvent(eventId, calendarId);
  res.status(200).json({ message: "Event removed" });
});

const updateEvent = asyncHandler(async (req, res) => {
  const { eventId, title, start, description } = req.body;
  await CalendarModel.updateEvent(eventId, title, start, description);
  res.status(200).json({ message: "Event updated" });
});

module.exports = {
  getAllCalendar,
  getEvents,
  addEvent,
  removeEvent,
  updateEvent,
};
